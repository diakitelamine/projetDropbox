import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { auth } from "../../_actions/user_actions";
import { withRouter } from "react-router-dom";

import { AppBar, Button, Toolbar, Menu, MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SettingsIcon from "@material-ui/icons/Settings";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    background: "#757ce8",
  },
  title: {
    flexGrow: 1,
  },
  settingsIcon: {
    marginRight: theme.spacing(1),
  },
}));

function Header(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [isLogin, setIsLogin] = useState(false);
  const [anchorElSettings, setAnchorElSettings] = useState(null);
  const [anchorElMypage, setAnchorElMypage] = useState(null);
  // const [checked, setChecked] = useState(false);
  const openSettings = Boolean(anchorElSettings);
  const openMypage = Boolean(anchorElMypage);

  useEffect(() => {
   // Chaque fois que la page est déplacée, l'envoi est activé et le backend est continuellement sollicité.
    dispatch(auth()).then((response) => {
      // Lorsqu'il n'est pas connecté, affiche le bouton de connexion
      if (!response.payload.isAuth) {
        setIsLogin(false);
      } else {
        // Une fois connecté, affiche le bouton membre
        // Bouton Membre avec deux menus: Ma page et Déconnexion
        setIsLogin(true);
      }
    });
  }, [props.history.location.pathname]);

  const handleMenuSettings = (event) => {
    setAnchorElSettings(event.currentTarget);
  };

  const handleMenuMypage = (event) => {
    setAnchorElMypage(event.currentTarget);
  };

  const handleCloseSettings = () => {
    setAnchorElSettings(null);
  };

  const handleCloseMypage = () => {
    setAnchorElMypage(null);
  };

  const handleLogout = () => {
    axios.get("/api/users/logout").then((response) => {
      if (response.data.success) {
        setIsLogin(false);
        props.history.push("/login");
      } else {
        alert("Échec de la déconnexion.");
      }
    });
    setAnchorElMypage(null);
  };

  const handleLogin = () => {
    props.history.push("/login");
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <a href="/" style={{ color: "white", textDecoration: "none" }}>
              Dropbox
            </a>
          </Typography>
          <IconButton
            aria-label="Réglages"
            aria-haspopup="true"
            color="inherit"
            onClick={handleMenuSettings}
          >
            <SettingsIcon className={classes.settingsIcon} />
          </IconButton>
          <Menu
            id="settings-appbar"
            anchorEl={anchorElSettings}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={openSettings}
            onClose={handleCloseSettings}
          >
            <MenuItem onClick={handleCloseSettings}>Réglage 1</MenuItem>
            <MenuItem onClick={handleCloseSettings}>Réglage 2</MenuItem>
          </Menu>
          {/* // Afficher le bouton membre une fois connecté  */}
          {isLogin && (
            <div>
              <IconButton
                aria-label="Compte"
                aria-haspopup="true"
                color="inherit"
                onClick={handleMenuMypage}
              >
                <AccountCircleIcon />
              </IconButton>
              <Menu
                id="settings-appbar"
                anchorEl={anchorElMypage}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={openMypage}
                onClose={handleCloseMypage}
              >
                <MenuItem onClick={handleCloseMypage}>Ma page</MenuItem>
                <MenuItem onClick={handleLogout}>Se déconnecter</MenuItem>
              </Menu>
            </div>
          )}
          {/* Lorsqu'il n'est pas connecté, le bouton de connexion s'affiche. */}
          {!isLogin && (
            <div>
              <Button color="inherit" onClick={handleLogin}>
              S'identifier
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default withRouter(Header);
