import React from "react";

import { RouteComponentProps, withRouter } from "react-router-dom";

import { NewsButtonContainer } from "../../../containers/App/Topbar/NewsButton";

type Props = Readonly<RouteComponentProps<{}>>;

function RouteContainer(_props: Props) {
  return <NewsButtonContainer />;
}

export const NewsButtonRouteContainer = withRouter(RouteContainer);
