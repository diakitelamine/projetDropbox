import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Header from "./components/Header/Header";
import LandingPage from "./components/LandingPage/LandingPage";
import LoginPage from "./components/LoginPage/LoginPage";
import RegisterPage from "./components/RegisterPage/RegisterPage";
import ForgotPasswordPage from "./components/FindPasswordPage/ForgotPasswordPage";
import ResetPasswordPage from "./components/FindPasswordPage/ResetPasswordPage";
import Auth from "./hoc/auth";

export default function App() {
  return (
    <Router>
      <div>
        <Header />
        {}
        <Switch>
          <Route exact path="/" component={Auth(LandingPage, null)} />
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
          <Route
            exact
            path="/forgot"
            component={Auth(ForgotPasswordPage, false)}
          />
          <Route
            path="/reset/:token"
            component={Auth(ResetPasswordPage, false)}
          />
        </Switch>
      </div>
    </Router>
  );
}
