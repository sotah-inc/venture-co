import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { BaseAuctionContainer } from "../../containers/entry-point/BaseAuction";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return (
    <BaseAuctionContainer
      redirectToRegion={region =>
        router.replace("/auctions/[region_name]", `/auctions/${region.config_region.name}`)
      }
    />
  );
}

export const BaseAuctionRouteContainer = withRouter(RouteContainer);
