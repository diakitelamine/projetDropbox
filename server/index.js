const express = require('express');
const morgan = require('morgan')
const path = require('path');
require = require('esm')(module)
const fileRoute = require('./routes/file');

require('./config/db');
const bodyParser = require('body-parser')
const cors = require('cors')
// Config dotev
require('dotenv').config({
    path: './config/config.env'
})
const app = express();

// body parser
app.use(bodyParser.json())
// Load routes

const authRouter = require('./routes/auth.route')
const userRouter = require('./routes/user.route');
module.exports = require('./config/config')
const { NODE_ENV, CLIENT_URL } = require('./config/config');
// Use Routes
app.use('/api', authRouter);
app.use('/api', userRouter);

// Dev Logginf Middleware
if (NODE_ENV === 'development') {
  app.use(cors({
      origin: CLIENT_URL
  }))
  app.use(morgan('dev'))
}




app.use(express.static(path.join(__dirname, '..', 'build')));
app.use('/api', fileRoute);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

app.listen(3030, () => {
  console.log('server started on port 3030');
});
