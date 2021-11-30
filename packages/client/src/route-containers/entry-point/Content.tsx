import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { ContentContainer } from "../../containers/entry-point/Content";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return <ContentContainer redirectToNews={() => router.replace("/content/news")} />;
}

export const ContentRouteContainer = withRouter(RouteContainer);
