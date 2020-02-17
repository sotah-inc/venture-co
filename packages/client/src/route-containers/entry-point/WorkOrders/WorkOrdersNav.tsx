import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { WorkOrdersNavContainer } from "../../../containers/entry-point/WorkOrders/WorkOrdersNav";
import { toWorkOrders } from "../../../util/routes";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return (
    <WorkOrdersNavContainer
      browseTo={(region, realm) => {
        const { url, asDest } = toWorkOrders(region, realm);

        (async () => {
          await router.replace(`/${url}`, `/${asDest}`);
        })();
      }}
    />
  );
}

export const WorkOrdersNavRouteContainer = withRouter(RouteContainer);
