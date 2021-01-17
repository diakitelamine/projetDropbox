# app dropbox

## Features

- Simple boilerplate to develop a MERN app
  - What is MERN Stack?
  - Mongo DB + Express.js + React.js + Node.js
- Register / login / logout / find & reset password
- Beautiful Material UI

## For Developers

### Before you run the app - basic settings

In the server directory, you can find a folder named `config`.<br />
Make a file named `dev.js`.<br />
And type your settings as below:

```
module.exports = {
  mongoURI:
    "mongodb+srv://----YOUR-MONGODB-ATLAS-KEY----",
  emailAddress: "----YOUR-GMAIL-ADDRESS----",
  emailPassword: "----YOUR-MAIL-PASSWORD----",
};
```

email address will be used as a mail which sends password reset messages.

### When you run the app

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.
