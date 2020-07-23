import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";
import React from "react";

import { IOwnProps } from "../../components/entry-point/AuctionList";
import { AuctionsListContainer } from "../../containers/entry-point/AuctionList";
import { extractString } from "../../util";

type Props = Readonly<WithRouterProps & IOwnProps>;

function RouteContainer({ router, realmEntrypointData, auctionListEntrypointData, loadId }: Props) {
  return (
    <AuctionsListContainer
      routeParams={{
        realm_slug: extractString("realm_slug", router.query),
        region_name: extractString("region_name", router.query),
      }}
      browseToRealmAuctions={(region, realm) =>
        router.replace(
          "/data/[region_name]/[realm_slug]/auctions",
          `/data/${region.config_region.name}/${realm.realm.slug}/auctions`,
        )
      }
      realmEntrypointData={realmEntrypointData}
      auctionListEntrypointData={auctionListEntrypointData}
      loadId={loadId}
    />
  );
}

export const AuctionListRouteContainer = withRouter(RouteContainer);
