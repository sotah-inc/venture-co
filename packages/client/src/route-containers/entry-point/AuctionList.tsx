import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";
import React from "react";

import { IOwnProps } from "../../components/entry-point/AuctionList";
import { AuctionsListContainer } from "../../containers/entry-point/AuctionList";
import { extractString } from "../../util";

type Props = Readonly<WithRouterProps & IOwnProps>;

function RouteContainer({ router, realmEntrypointData, auctionListEntrypointData }: Props) {
  return (
    <AuctionsListContainer
      routeParams={{
        realm_slug: extractString("realm_slug", router.query),
        region_name: extractString("region_name", router.query),
      }}
      browseToRealmAuctions={(region, realm) =>
        router.push(`/data/${region.name}/${realm.slug}/auctions`)
      }
      realmEntrypointData={realmEntrypointData}
      auctionListEntrypointData={auctionListEntrypointData}
    />
  );
}

export const AuctionListRouteContainer = withRouter(RouteContainer);
