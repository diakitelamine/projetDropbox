const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const { auth } = require("../middleware/auth");

// À propos de l'envoi d'un e-mail de réinitialisation de mot de passe
const config = require("../config/key");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const moment = require("moment");
// Réglez l'heure sur KST sur le serveur heroku
require("moment-timezone");
moment.tz.setDefault("Europe/London");

//=================================
//             User
//=================================

router.post("/login", (req, res) => {
  // Trouvez l'e-mail demandé dans DB
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "Il n'y a aucun utilisateur avec cet e-mail.",
      });
    }
    // Si vous trouvez un utilisateur, assurez-vous que le mot de passe est le même
    user.comparePassword(req.body.password, (err, isSame) => {
      if (!isSame)
        return res.json({
          loginSuccess: false,
          message: "Veuillez saisir le mot de passe correct.",
        });

      // Si le mot de passe est le même, créez un jeton
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        // Il existe différentes manières de stocker des jetons tels que les cookies, le stockage local et les sessions.
        // Les cookies sont utilisés ici
        res.cookie("x_authExp", user.tokenExp);
        res
          .cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

router.post("/register", (req, res) => {
  //Lorsqu'on reçois  les informations nécessaires lors de l'inscription, mettez-les dans le DB.
  const user = new User(req.body); 

  user.save((err, userInfo) => {
    //En cas d'échec ou de succès, il est remis à l'utilisateur au format JSON
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
      userInfo: userInfo,
    });
  });
});

// auth Le middleware. Après avoir reçu la demande, avant de passer la fonction de rappel.
router.get("/auth", auth, (req, res) => {
  
  // Passing the middleware so far = Authentification réussie
  // Sélectionne les informations utilisateur pertinentes et les envoie au front-end.
  res.status(200).json({
    _id: req.user.id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    role: req.user.role,
  });
});

// Se déconnecter. La raison pour laquelle j'ai mis le middleware d'authentification 
//est que je suis connecté avant de me déconnecter
router.get("/logout", auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    { token: "", tokenExp: "" },
    (err, user) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true,
      });
    }
  );
});


// API d'envoi de courrier de réinitialisation du mot de passe
router.post("/forgot", (req, res) => {
  if (req.body.email === "") {
    req.status(400).send({ message: "Veuillez saisir votre adresse e-mail." });
  }

  
// Trouver l'e-mail demandé dans DB
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      console.error("email not in database");
      return res.json({
        emailInDB: false,
        message: "email not found",
      });
    } else {
      // Si vous trouvez un utilisateur, créez un jeton de hachage
      // Utilisation de moment (). ValueOf () au lieu de Date.now ()
      // Pour utiliser la même valeur de temps partout où le serveur est dans le monde
      const resetToken = crypto.randomBytes(20).toString("hex");
      user.resetPwdToken = resetToken;
      user.resetPwdExp = moment().valueOf() + 600000; //Période de validité de 10 minutes
      user.save();

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: 'diakitelamine555@gmail.com',
          pass: 'la',
        },
      });

      let tenMinsFromNow = moment().add(10, "minutes").format("LT");

      const message = {
        from: `${config.emailAddress}`,
        to: `${user.email}`,
        bcc: "diakitelamine555@gmail.com",
        subject: "[dropbox] Guide de réinitialisation du mot de passe",
        html:`
        <h1>Please use the following to activate your account</h1>
        <p>Le lien est valable jusque ${tenMinsFromNow}</p>
        <p>localhost:3000/reset/${user.resetPwdToken}</p>
        <hr />
        <p>This email may containe sensetive information</p>
        <p>"Veuillez ignorer l'e-mail si vous ne l'avez jamais demandé Votre mot de passe reste inchangé et sécurisé.\n\n" +
        "Diakite Lamine Cordialement." </p>
    `
      };

      console.log("Envoi d'e-mail...");
      let sentValid = true;

      transporter.sendMail(message, (err, info) => {
        if (err) {
          console.log("Erreur lors de l'envoi de l'e-mail: ", err);
          sentValid = false;
          return err;
        } else {
          console.log("Transmission de l'e-mail terminée!", info.response);
        }
      });
      // Pourquoi devrions-nous soustraire le retour de la fonction de rappel de sendMail?
      // C'est parce que nodemailer utilise un processus asynchrone pour l'envoi d'e-mails.
      // Donc, la réponse doit être retournée après la fonction sendMail.
      // Si return est mis dans la fonction de rappel de sendMail, la réponse ne mourra pas!
      if (sentValid) {
        return res.status(200).json({
          message: "password reset mail sent",
        });
      } else {
        return res.status(500).json({
          message: "Échec de l'envoi de l'e-mail",
        });
      }
    }
  });
});

// API de réinitialisation de mot de passe
router.post("/reset", (req, res, next) => {
  User.findOne({
    resetPwdToken: req.body.resetPwdToken,
    resetPwdExp: { $gt: moment().valueOf() },
  })
    .then((user) => {
      if (!user) {
        return res.json({
          message: "link not valid",
        });
      } else {
        // S'il y a des utilisateurs ...
        // Si le nouveau mot de passe correspond au mot de passe existant, rejeter
        user.comparePassword(req.body.password, (err, isSame) => {
          if (isSame)
            return res.json({
              pwdNotChanged: true,
              message: "Identique à l'ancien mot de passe. Veuillez saisir un mot de passe différent.",
            });
          // Si vous avez franchi cette porte, mettez à jour avec un nouveau mot de passe.
          user.password = req.body.password;
          user.resetPwdToken = null;
          user.resetPwdExp = null;

          user.save((err, userInfo) => {
            // En cas d'échec ou de succès, il est remis à l'utilisateur au format JSON
            if (err) return res.json({ success: false, err });
            return res.status(200).json({
              success: true,
              userInfo: userInfo,
            });
          });
        });
      }
    })
    .catch((err) => {
      console.log("Erreur de réinitialisation du mot de passe.\n", err);
    });
});

module.exports = router;
