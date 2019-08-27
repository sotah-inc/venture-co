import React from "react";

import { RouteComponentProps, withRouter } from "react-router-dom";

import { AppContainer } from "../containers/App";

type Props = Readonly<RouteComponentProps<{}>>;

function RouteContainer(_props: Props) {
  return <AppContainer />;
}

export const AppRouteContainer = withRouter(RouteContainer);
