import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { AuctionsLandingContainer } from "../../containers/App/AuctionsLanding";
import { extractString } from "../../util";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return (
    <AuctionsLandingContainer
      routeParams={{ region_name: extractString("region_name", router.query) }}
      redirectToAuctions={(region, realm) =>
        router.replace(
          "/data/[region_name]/[realm_slug]/auctions",
          `/data/${region.config_region.name}/${realm.realm.slug}/auctions`,
        )
      }
    />
  );
}

export const AuctionsLandingRouteContainer = withRouter(RouteContainer);
