import React, { ReactNode } from "react";

import { Provider } from "react-redux";
import { applyMiddleware, createStore, Middleware, Store } from "redux";
import thunk from "redux-thunk";

import { USER_LOGIN, USER_REGISTER } from "./actions/main";
import { OvenContainer } from "./containers/util/Oven";
import { rootReducer } from "./reducers";
import { AppRouteContainer } from "./route-containers/App";
import {
  defaultAuctionState,
  defaultMainState,
  defaultOvenState,
  defaultPostsState,
  defaultPriceListsState,
  defaultProfileState,
  IStoreState,
} from "./types";

export const defaultState: IStoreState = {
  Auction: defaultAuctionState,
  Main: defaultMainState,
  Oven: defaultOvenState,
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
  viewport: ReactNode;
  predefinedState?: IStoreState;
}

export const Boot = ({ viewport, predefinedState }: IProps) => {
  if (store === null) {
    const preloadedState = typeof predefinedState === "undefined" ? defaultState : predefinedState;

    store = createStore(
      rootReducer,
      preloadedState,
      applyMiddleware(localStorageMiddleware, thunk),
    );
  }

  return (
    <div className="pure-g">
      <div className="pure-u-1">
        <Provider store={store}>
          <AppRouteContainer viewport={viewport} />
          <OvenContainer />
        </Provider>
      </div>
    </div>
  );
};
