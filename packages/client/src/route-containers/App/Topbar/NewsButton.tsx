import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { NewsButtonContainer } from "../../../containers/App/Topbar/NewsButton";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return <NewsButtonContainer locationPathname={router.pathname} />;
}

export const NewsButtonRouteContainer = withRouter(RouteContainer);
