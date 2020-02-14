import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { IOwnProps } from "../../components/entry-point/WorkOrders";
import { WorkOrdersContainer } from "../../containers/entry-point/WorkOrders";
import { extractString } from "../../util";
import { toWorkOrders } from "../../util/routes";

type Props = Readonly<WithRouterProps & IOwnProps>;

function RouteContainer({ router, workOrderEntrypointData }: Props) {
  return (
    <WorkOrdersContainer
      routeParams={{
        realm_slug: extractString("realm_slug", router.query),
        region_name: extractString("region_name", router.query),
      }}
      browseTo={(region, realm, page, perPage) => {
        const { url, asDest } = toWorkOrders(region, realm, page, perPage);

        (async () => {
          await router.replace(`/${url}`, `/${asDest}`);
        })();
      }}
      workOrderEntrypointData={workOrderEntrypointData}
    />
  );
}

export const WorkOrdersRouteContainer = withRouter(RouteContainer);
