import * as React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { Content } from "../../components/App/Content";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return <Content browseToNews={() => router.replace("/content/news")} />;
}

export const ContentRouteContainer = withRouter(RouteContainer);
