import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { AppContainer } from "../containers/App";

type Props = Readonly<WithRouterProps>;

function RouteContainer(_props: Props) {
  return <AppContainer />;
}

export const AppRouteContainer = withRouter(RouteContainer);
