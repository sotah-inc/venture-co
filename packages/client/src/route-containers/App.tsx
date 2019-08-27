import React from "react";

import { BrowserRouter, RouteComponentProps, withRouter } from "react-router-dom";

import { AppContainer } from "../containers/App";

type Props = Readonly<RouteComponentProps<{}>>;

function RouteContainer(_props: Props) {
  return (
    <BrowserRouter>
      <AppContainer />
    </BrowserRouter>
  );
}

export const AppRouteContainer = withRouter(RouteContainer);
