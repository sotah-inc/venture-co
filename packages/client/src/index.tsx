import React, { ReactNode } from "react";

import { Cookies, CookiesProvider } from "react-cookie";
import { Provider } from "react-redux";
import { applyMiddleware, compose, createStore, Store } from "redux";
import thunk from "redux-thunk";

import { ILoadRootEntrypoint } from "./actions/main";
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
  const cookies = new Cookies(cookiesHeader ?? null);
  const cookiesToken = cookies.get("token");
  if (cookiesToken) {
    defaultState.Main.preloadedToken = cookiesToken;
  }

  if (store === null) {
    const composeEnhancers = (() => {
      if (typeof window === "undefined") {
        return compose;
      }

      // eslint-disable-next-line no-underscore-dangle
      return (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    })();

    store = createStore(
      rootReducer,
      predefinedState ?? defaultState,
      composeEnhancers(applyMiddleware(thunk)),
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
