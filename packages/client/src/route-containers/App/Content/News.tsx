import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { NewsContainer } from "../../../containers/App/Content/News";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return <NewsContainer historyPush={destination => router.push(destination)} />;
}

export const NewsRouteContainer = withRouter(RouteContainer);
