import React, { ReactNode } from "react";

import { Cookies, CookiesProvider } from "react-cookie";
import { Provider } from "react-redux";
import { AnyAction, applyMiddleware, compose, createStore, Dispatch, Store } from "redux";
import thunk from "redux-thunk";

import { ILoadRootEntrypoint, USER_LOGIN, USER_REGISTER } from "./actions/main";
import { OvenContainer } from "./containers/util/Oven";
import { rootReducer } from "./reducers";
import { AppRouteContainer } from "./route-containers/App";
import {
  defaultAuctionState,
  defaultMainState,
  defaultOvenState,
  defaultPostsState,
  defaultPriceListsState,
  defaultProfessionsState,
  defaultProfileState,
  defaultWorkOrderState,
  IStoreState,
} from "./types";

export const defaultState: IStoreState = {
  Auction: defaultAuctionState,
  Main: defaultMainState,
  Oven: defaultOvenState,
  Posts: defaultPostsState,
  PriceLists: defaultPriceListsState,
  Professions: defaultProfessionsState,
  Profile: defaultProfileState,
  WorkOrder: defaultWorkOrderState,
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

function localStorageMiddleware() {
  return (next: Dispatch) => (action: AnyAction) => {
    switch (action.type) {
    case USER_LOGIN:
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("token", action.payload.token);
      }

      break;
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
}

type StoreType = Store<IStoreState>;

let store: StoreType | null = null;

interface IProps {
  viewport: ReactNode;
  predefinedState?: IStoreState;
  rootEntrypointData?: ILoadRootEntrypoint;
  cookiesHeader?: string;
}

export function Boot({
  viewport,
  predefinedState,
  rootEntrypointData,
  cookiesHeader,
}: IProps): JSX.Element {
  if (store === null) {
    const preloadedState = typeof predefinedState === "undefined" ? defaultState : predefinedState;
    const composeEnhancers = (() => {
      if (typeof window === "undefined") {
        return compose;
      }

      // eslint-disable-next-line no-underscore-dangle
      return (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    })();

    store = createStore(
      rootReducer,
      preloadedState,
      composeEnhancers(applyMiddleware(localStorageMiddleware, thunk)),
    );
  }

  return (
    <div className="pure-g">
      <div className="pure-u-1">
        <Provider store={store}>
          <CookiesProvider cookies={new Cookies(cookiesHeader)}>
            <AppRouteContainer viewport={viewport} rootEntrypointData={rootEntrypointData} />
            <OvenContainer />
          </CookiesProvider>
        </Provider>
      </div>
    </div>
  );
}
