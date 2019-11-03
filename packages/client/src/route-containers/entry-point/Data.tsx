import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { DataContainer } from "../../containers/entry-point/Data";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return <DataContainer redirectToRegion={region => router.replace(`/data/${region.name}`)} />;
}

export const DataRouteContainer = withRouter(RouteContainer);
