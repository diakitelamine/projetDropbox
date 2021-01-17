import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import promiseMiddleware from "redux-promise";
import ReduxThunk from "redux-thunk";
import Reducer from "./_reducers"; 
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import "./index.css";



// set default Typography font of Material UI
const theme = createMuiTheme({
  typography: {
    fontFamily: ["Spoqa Han Sans", "Roboto", "sans-serif"].join(","),
  },
});

const createStoreWithMiddleware = applyMiddleware(
  promiseMiddleware,
  ReduxThunk
)(createStore);
const destination = document.getElementById("root");

ReactDOM.render(
  <Provider
    store={createStoreWithMiddleware(
      Reducer,
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__()
    )}
  >
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </Provider>,
  destination
);

serviceWorker.unregister();
