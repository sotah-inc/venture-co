import React from "react";
import ReactDOM from "react-dom";

import { Boot } from "@sotah-inc/client";
import "@sotah-inc/client/build/styles/venture-co.min.css";

import * as serviceWorker from "./serviceWorker";

ReactDOM.render(<Boot />, document.getElementById("client-local-dev-container"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
