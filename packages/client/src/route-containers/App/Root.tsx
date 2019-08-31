import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { Root } from "../../components/App/Root";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return <Root redirectToContent={() => router.replace("/content")} />;
}

export const RootRouteContainer = withRouter(RouteContainer);
