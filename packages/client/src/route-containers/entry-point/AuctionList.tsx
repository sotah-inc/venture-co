import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { IOwnProps } from "../../components/entry-point/AuctionList";
import { AuctionsListContainer } from "../../containers/entry-point/AuctionList";
import { toAuctions } from "../../util";
import { extractSlug } from "../../util/extract-slug";

type Props = Readonly<WithRouterProps & IOwnProps>;

function RouteContainer({ router, realmEntrypointData, auctionListEntrypointData, loadId }: Props) {
  const [nextGameVersion, nextRegionName, nextRealmSlug] = extractSlug("slug", router.query);

  return (
    <AuctionsListContainer
      routeParams={{
        game_version: nextGameVersion,
        realm_slug: nextRealmSlug,
        region_name: nextRegionName,
      }}
      browseToRealmAuctions={(gameVersion, region, realm) => {
        const routeConfig = toAuctions(gameVersion, region, realm);

        (async () => {
          await router.replace(routeConfig.url, routeConfig.asDest);
        })();
      }}
      realmEntrypointData={realmEntrypointData}
      auctionListEntrypointData={auctionListEntrypointData}
      loadId={loadId}
    />
  );
}

export const AuctionListRouteContainer = withRouter(RouteContainer);
