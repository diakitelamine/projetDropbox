const session= require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const { app } = require('../index');

app.use(session({
    secret: 'cersei',
    name:'jesuisduniD',
    resave:false,
    saveUninitialized:false,
    cookie:{
        httpOnly:true,
        maxAge: 1000 * 60 * 60 * 24 * 24  // Une session de 14 days
    },
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 60 * 60 * 24 * 24
    })
}));