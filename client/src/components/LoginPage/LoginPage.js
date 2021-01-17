import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
// import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useDispatch } from "react-redux";
import { loginUser } from "../../_actions/user_actions";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © Dropbox  "}
      {new Date().getFullYear()}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: "#3f50b5",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: "#757ce8",
    color: "white",
  },
}));

export default function LoginPage(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);

  const emailHandler = (event) => {
    setEmail(event.currentTarget.value);
  };

  const passwordHandler = (event) => {
    setPassword(event.currentTarget.value);
  };

  const onSubmitHandler = (event) => {
    event.preventDefault(); // page refresh 

    let body = {
      email: Email,
      password: Password,
    };

    // _actions/user_action.js de loginUser Envoyé à Traité avec Axios
    dispatch(loginUser(body)).then((response) => {
      if (response.payload.loginSuccess) {
        //Utilisez props.history.push lors du déplacement de pages
        props.history.push("/");
      } else {
        setLoginError(true);
      }
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5"> 
         S'identifier
        </Typography>
        <form className={classes.form} onSubmit={onSubmitHandler} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Adresse e-mail"
            name="email"
            autoComplete="email"
            autoFocus
            value={Email}
            onChange={emailHandler}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Mot de passe"
            type="password"
            id="password"
            autoComplete="current-password"
            value={Password}
            onChange={passwordHandler}
          />
          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label=""
          /> */}
          {loginError && (
            <Alert severity="error">
              Échec de la connexion. <br />
              Veuillez vérifier à nouveau votre identifiant ou votre mot de passe.
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            className={classes.submit}
          >
           S'identifier
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/forgot" variant="body2">
              Mot de passe oublié
              </Link>
            </Grid>
            <Grid item>
              <Link href="/register" variant="body2">
                {"S'inscrire"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
