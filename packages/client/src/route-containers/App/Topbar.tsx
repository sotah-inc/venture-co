import React from "react";

import { RouteComponentProps, withRouter } from "react-router-dom";

import { TopbarContainer } from "../../containers/App/Topbar";

type Props = Readonly<RouteComponentProps<{}>>;

function RouteContainer({ location }: Props) {
  return <TopbarContainer locationPathname={location.pathname} />;
}

export const TopbarRouteContainer = withRouter(RouteContainer);
