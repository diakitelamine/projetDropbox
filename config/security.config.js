
// Cette methode permet de proteger les pages qui necessite une authenfication
exports.ensureAuthenticated = (req, res, next)=>{
    if(req.isAuthenticated()){
        next();
    }else{
        res.status(403).redirect('/auth/signin/form');
    }
}


// Roles Admin a implementer si besoin 
exports.ensureAdmin = (req, res, next)=>{
    if(req.isAuthenticated() && req.user.roles.includes('ROLE_ADMIN')){
        next();
    }else{
        res.status(403).redirect('/auth/signin/form');
    }
}