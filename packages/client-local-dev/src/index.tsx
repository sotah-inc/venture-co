import React from "react";
import ReactDOM from "react-dom";

import { Boot } from "@sotah-inc/client";
import "@sotah-inc/client/styles/App.scss";
import "@sotah-inc/client/styles/AuctionTable.scss";
import "@sotah-inc/client/styles/blueprint-variables.scss";
import "@sotah-inc/client/styles/CreateEntryForm.scss";
import "@sotah-inc/client/styles/ItemPopover.scss";
import "@sotah-inc/client/styles/News.scss";
import "@sotah-inc/client/styles/PriceLists.scss";

import * as serviceWorker from "./serviceWorker";

ReactDOM.render(<Boot />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
