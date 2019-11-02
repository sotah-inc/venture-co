import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { IOwnProps } from "../components/App";
import { AppContainer } from "../containers/App";

type Props = Readonly<WithRouterProps & IOwnProps>;

function RouteContainer({ viewport, rootEntrypointData }: Props) {
  return <AppContainer viewport={viewport} rootEntrypointData={rootEntrypointData} />;
}

export const AppRouteContainer = withRouter(RouteContainer);
