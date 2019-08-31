import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { NewsButtonContainer } from "../../../containers/App/Topbar/NewsButton";

type Props = Readonly<WithRouterProps>;

function RouteContainer(_props: Props) {
  return <NewsButtonContainer />;
}

export const NewsButtonRouteContainer = withRouter(RouteContainer);
