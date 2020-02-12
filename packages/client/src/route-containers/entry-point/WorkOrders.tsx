import React from "react";

import { RealmSlug, RegionName } from "@sotah-inc/core";
import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { IOwnProps } from "../../components/entry-point/WorkOrders";
import { WorkOrdersContainer } from "../../containers/entry-point/WorkOrders";
import { extractString } from "../../util";

type Props = Readonly<WithRouterProps & IOwnProps>;

function RouteContainer({ router, workOrderEntrypointData }: Props) {
  return (
    <WorkOrdersContainer
      routeParams={{
        realm_slug: extractString("realm_slug", router.query),
        region_name: extractString("region_name", router.query),
      }}
      browseTo={(_regionName: RegionName, _realmSlug: RealmSlug) => {
        return;
      }}
      workOrderEntrypointData={workOrderEntrypointData}
    />
  );
}

export const RealmRouteContainer = withRouter(RouteContainer);
