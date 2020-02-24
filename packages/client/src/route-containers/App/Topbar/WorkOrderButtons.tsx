import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { WorkOrdersButtonContainer } from "../../../containers/App/Topbar/WorkOrdersButton";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return <WorkOrdersButtonContainer locationPathname={router.pathname} />;
}

export const WorkOrdersButtonRouteContainer = withRouter(RouteContainer);
