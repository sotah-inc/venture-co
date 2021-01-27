import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { BaseAuctionsContainer } from "../../containers/entry-point/BaseAuctions";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return (
    <BaseAuctionsContainer
      redirectToRegion={region =>
        router.replace("/auctions/[region_name]", `/auctions/${region.config_region.name}`)
      }
    />
  );
}

export const BaseAuctionsRouteContainer = withRouter(RouteContainer);
