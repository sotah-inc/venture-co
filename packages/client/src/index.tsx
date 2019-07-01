import * as React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { applyMiddleware, createStore, Middleware } from "redux";
import thunk from "redux-thunk";

import { USER_LOGIN, USER_REGISTER } from "./actions/main";
import { rootReducer } from "./reducers";
import { AppRouteContainer } from "./route-containers/App";
import {
  defaultAuctionState,
  defaultMainState,
  defaultPostsState,
  defaultPriceListsState,
  defaultProfileState,
  IStoreState,
} from "./types";

const defaultState: IStoreState = {
  Auction: defaultAuctionState,
  Main: defaultMainState,
  Posts: defaultPostsState,
  PriceLists: defaultPriceListsState,
  Profile: defaultProfileState,
};

const token = localStorage.getItem("token");
if (token !== null) {
  defaultState.Main.preloadedToken = token;
}

const localStorageMiddleware: Middleware = () => next => action => {
  switch (action.type) {
    case USER_LOGIN:
    case USER_REGISTER:
      localStorage.setItem("token", action.payload.token);

      break;
    default:
      break;
  }

  return next(action);
};

const store = createStore(
  rootReducer,
  defaultState,
  applyMiddleware(localStorageMiddleware, thunk),
);

export const Boot = () => {
  return (
    <div className="pure-g" id="top-root">
      <div className="pure-u-1" id="root">
        <Provider store={store}>
          <Router>
            <AppRouteContainer />
          </Router>
        </Provider>
      </div>
    </div>
  );
};

export const Hello = () => <p>Hello, world!</p>;
