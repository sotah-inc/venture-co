import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { IOwnProps } from "../../components/entry-point/News";
import { NewsContainer } from "../../containers/entry-point/News";

type Props = Readonly<WithRouterProps & IOwnProps>;

function RouteContainer({ router, posts }: Props) {
  return <NewsContainer historyPush={destination => router.push(destination)} posts={posts} />;
}

export const NewsRouteContainer = withRouter(RouteContainer);
