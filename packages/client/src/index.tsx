import React, { ReactNode } from "react";

import { Provider } from "react-redux";
import { applyMiddleware, createStore, Middleware, Store } from "redux";
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

const token: string | null = (() => {
  if (typeof localStorage === "undefined") {
    return null;
  }

  return localStorage.getItem("token");
})();
if (token !== null) {
  defaultState.Main.preloadedToken = token;
}

const localStorageMiddleware: Middleware = () => next => action => {
  switch (action.type) {
    case USER_LOGIN:
    case USER_REGISTER:
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("token", action.payload.token);
      }

      break;
    default:
      break;
  }

  return next(action);
};

type StoreType = Store<IStoreState>;

let store: StoreType | null = null;

interface IProps {
  Viewport: ReactNode;
  PredefinedState?: IStoreState;
}

export const Boot = ({ Viewport, PredefinedState }: IProps) => {
  if (store === null) {
    store = createStore(
      rootReducer,
      typeof PredefinedState === "undefined" ? defaultState : PredefinedState,
      applyMiddleware(localStorageMiddleware, thunk),
    );
  }

  return (
    <div className="pure-g">
      <div className="pure-u-1">
        <Provider store={store}>
          <AppRouteContainer Viewport={Viewport} />
        </Provider>
      </div>
    </div>
  );
};

export const Hello = () => <p>Hello, world!</p>;
