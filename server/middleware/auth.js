const { User } = require("../models/User");
const moment = require("moment");

let auth = (req, res, next) => {
   // Récupère le jeton du cookie client.
  let token = req.cookies.x_auth;

  const isJWTExpired = (tokenExp) => {
    // Heure actuelle> heure tokenExp: date d'expiration JWT (retour vrai)
    let now = moment().valueOf();
    return now > tokenExp;
  };

  
// Le jeton est-il obtenu à partir du cookie de cet utilisateur?
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true });
    if (isJWTExpired(user.tokenExp))
      return res.json({ isAuth: false, message: "JWT token has expired." });

    req.token = token;
    req.user = user;
    next();
  });
};

module.exports = { auth };
