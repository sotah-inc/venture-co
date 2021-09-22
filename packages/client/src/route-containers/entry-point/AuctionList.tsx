import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { IOwnProps } from "../../components/entry-point/AuctionList";
import { AuctionsListContainer } from "../../containers/entry-point/AuctionList";
import { extractSlug } from "../../util/extract-slug";

type Props = Readonly<WithRouterProps & IOwnProps>;

function RouteContainer({ router, realmEntrypointData, auctionListEntrypointData, loadId }: Props) {
  const [nextRegionName, nextRealmSlug] = extractSlug("slug", router.query);

  return (
    <AuctionsListContainer
      routeParams={{
        realm_slug: nextRealmSlug,
        region_name: nextRegionName,
      }}
      browseToRealmAuctions={(region, realm) =>
        router.replace(
          "/auctions/[region_name]/[realm_slug]",
          `/auctions/${region.name}/${realm.realm.slug}`,
        )
      }
      realmEntrypointData={realmEntrypointData}
      auctionListEntrypointData={auctionListEntrypointData}
      loadId={loadId}
    />
  );
}

export const AuctionListRouteContainer = withRouter(RouteContainer);
