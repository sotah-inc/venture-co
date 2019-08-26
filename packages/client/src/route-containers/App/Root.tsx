import React from "react";

import { RouteComponentProps, withRouter } from "react-router-dom";

import { Root } from "../../components/App/Root";

type Props = Readonly<RouteComponentProps<{}>>;

function RouteContainer({ history }: Props) {
  return <Root redirectToContent={() => history.replace("/content")} />;
}

export const RootRouteContainer = withRouter(RouteContainer);
