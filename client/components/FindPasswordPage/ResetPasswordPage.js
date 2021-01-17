import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import axios from "axios";

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

export default function ResetPasswordPage(props) {
  const classes = useStyles();

  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [arePasswordsSame, setArePasswordsSame] = useState(true); // Are two password same?
  const [isLinkValid, setIsLinkValid] = useState(true); // Is link valid?
  const [isUsingPastPassword, setIsUsingPastPassword] = useState(false); // Did the user typed past password?

  const passwordHandler = (event) => {
    setPassword(event.currentTarget.value);
  };

  const confirmPasswordHandler = (event) => {
    setConfirmPassword(event.currentTarget.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    // 1. If the user didn't enter password...? => browser alert
    if (Password === "" || ConfirmPassword === "") {
      alert("Enter your password");
    } else if (Password !== ConfirmPassword) {
      // 2. Are two passwords different...? => Material UI Alert. below the Submit button.
      setArePasswordsSame(false);
      setIsUsingPastPassword(false);
    } else {
      setArePasswordsSame(true);
      setIsUsingPastPassword(false);

      // post data to server API with axios
      axios
        .post("/api/users/reset", {
          password: Password,
          resetPwdToken: props.location.pathname.slice(7),
        })
        .then((res) => {
          // 3. If the email reset link is not valid..
          if (res.data.message === "link not valid") {
            setIsLinkValid(false);
            setIsUsingPastPassword(false);
          } else {
            setIsLinkValid(true);
            setIsUsingPastPassword(false);
          }
          // 4. If the user enters the password that was used last time..
          if (res.data.pwdNotChanged === true) {
            setIsUsingPastPassword(true);
          }
          // 5. All clear: redirect to login page
          if (res.data.success === true && res.data.userInfo) {
            alert("Your password is now successfuly updated.");
            props.history.push("/login");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Reset Password
        </Typography>
        {!isLinkValid && (
          <Alert severity="error">
            Password reset URL is not valid.
            <br />
            Please try find password page once again.
          </Alert>
        )}
        {isLinkValid && (
          <form className={classes.form} onSubmit={submitHandler} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="new-password"
                  label="new password"
                  type="password"
                  id="new-password"
                  autoComplete="new-password"
                  value={Password}
                  onChange={passwordHandler}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="confirm password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={ConfirmPassword}
                  onChange={confirmPasswordHandler}
                />
              </Grid>
              {!arePasswordsSame && (
                <Grid item xs={12}>
                  <Alert severity="error">
                    Plase enter the password correctly.
                  </Alert>
                </Grid>
              )}
              {isUsingPastPassword && (
                <Grid item xs={12}>
                  <Alert severity="error">
                    You already used this password last time. <br />
                    Please set different password this time.
                  </Alert>
                </Grid>
              )}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className={classes.submit}
            >
              Continue
            </Button>
          </form>
        )}
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}
