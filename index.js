const express = require('express');
const path = require('path');
const morgan = require('morgan');
const fileRoute = require('./routes/file');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const cors = require('cors');
// Config dotev
require('dotenv').config({
    path: './config/config.env'
});


const app = express();
app.use(express.static(path.join(__dirname, '..', 'build')));
app.use(fileRoute);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
  });
// Connect to database
connectDB();

// body parser
app.use(bodyParser.json());
// Load routes
const authRouter = require('./routes/auth.route');
const userRouter = require('./routes/user.route');

// Dev Logginf Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(cors({
        origin: process.env.CLIENT_URL
    }))
    app.use(morgan('dev'))
}

// Use Routes
app.use('/api', authRouter);
app.use('/api', userRouter);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        msg: "Page not founded"
    })
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});