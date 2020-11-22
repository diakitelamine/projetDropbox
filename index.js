const express = require('express')
const morgan = require('morgan')
const connectDB = require('./config/db')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express();
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    res.header("Content-Type", "application/json");
    next();
});

global.bdd = require('./models/auth.model');
// Config dotev
require('dotenv').config({
    path: './config/config.env'
})


// Connect to database
connectDB();

// body parser
// Emplacement du dossier public dans express
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cors());
// Route par defautl - Importante
app.get('*', (req, res) => {
    // Verif user
    res.sendFile(`index.html`, { root: www });
});

// Load routes
const authRouter = require('./routes/auth.route')
const userRouter = require('./routes/user.route')

// Dev Logginf Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(cors({
        origin: process.env.CLIENT_URL
    }))
    app.use(morgan('dev'))
}


// Use Routes
app.use('/api', authRouter)
app.use('/api', userRouter)

app.use((req, res) => {
    res.status(404).json({
        success: false,
        msg: "Page not founded"
    })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});