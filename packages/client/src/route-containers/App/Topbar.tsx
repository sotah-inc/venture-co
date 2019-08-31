import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { TopbarContainer } from "../../containers/App/Topbar";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return <TopbarContainer locationPathname={router.pathname} />;
}

export const TopbarRouteContainer = withRouter(RouteContainer);
