import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { Content } from "../../components/entry-point/Content";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return <Content redirectToNews={() => router.replace("/content/news")} />;
}

export const ContentRouteContainer = withRouter(RouteContainer);
