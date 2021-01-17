const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const saltRounds = 10; 
// Longueur de sel requise pour le chiffrement de hachage
const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true, 
    unique: 1,
  },
  password: {
    type: String,
    minlength: 8,
  },
  role: {
    type: Number, 
    default: 0,
  },
  image: String,
  token: {
    type: String, 
  },
  tokenExp: {
    type: Number,
  },
  resetPwdToken: {
    type: String,
  },
  resetPwdExp: {
    type: Number,
  },
});

// pre()Et exécutez save () de index.js. next() -> save()
userSchema.pre("save", function (next) {
  let user = this; 

  // Hash cryptage du mot de passe uniquement lorsque le mot de passe est changé (isModified)
  if (user.isModified("password")) {
    // Chiffrement de hachage
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, (err, encrypted) => {
        if (err) return next(err);
        user.password = encrypted;
        next();
      });
    });
  } else {
    next();
  }
});

// comparePassword
userSchema.methods.comparePassword = function (plainPassword, cb) {
  // plainPassword == Mot de passe haché ?
  // cb est la fonction de rappel
  bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  // Créer un jeton à l'aide de jsonwebtoken
  let user = this;
  let token = jwt.sign(user._id.toHexString(), "secret-Token");
  let halfHour = moment().add(30, "minutes").valueOf();

  user.tokenExp = halfHour;
  user.token = token;
  user.save((err, user) => {
    if (err) return cb(err);
    cb(null, user);
  });
};

// static method User Méthodes pouvant être utilisées directement dans le modèle
userSchema.statics.findByToken = function (token, cb) {
  let user = this;

  // Déchiffrez le jeton.
  jwt.verify(token, "secret-Token", (err, decodedToken) => {
    // Après avoir trouvé l'utilisateur à l'aide de l'ID utilisateur
    // Vérifier si le jeton obtenu du client et le jeton stocké dans la base de données correspondent
    user.findOne({ _id: decodedToken, token: token }, (err, user) => {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
