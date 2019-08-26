import React from "react";

import { RouteComponentProps, withRouter } from "react-router-dom";

import { NewsContainer } from "../../../containers/App/Content/News";

type Props = Readonly<RouteComponentProps<{}>>;

function RouteContainer({ history }: Props) {
  return <NewsContainer historyPush={destination => history.push(destination)} />;
}

export const NewsRouteContainer = withRouter(RouteContainer);
