import * as React from "react";

import { RouteComponentProps, withRouter } from "react-router-dom";

import { Content } from "../../components/App/Content";

type Props = Readonly<RouteComponentProps<{}>>;

function RouteContainer({ history }: Props) {
  return <Content browseToNews={() => history.replace("/content-news")} />;
}

export const ContentRouteContainer = withRouter(RouteContainer);
