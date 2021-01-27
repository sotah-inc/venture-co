import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { IOwnProps } from "../../components/entry-point/Region";
import { RegionAuctionsContainer } from "../../containers/entry-point/RegionAuctions";
import { extractSlug } from "../../util/extract-slug";

type Props = Readonly<WithRouterProps & IOwnProps>;

function RouteContainer({ router, regionEntrypointData }: Props) {
  const [nextRegionName] = extractSlug("slug", router.query);

  return (
    <RegionAuctionsContainer
      routeParams={{ region_name: nextRegionName }}
      browseToRealmAuctions={(region, realm) =>
        router.replace(
          "/auctions/[region_name]/[realm_slug]",
          `/auctions/${region.config_region.name}/${realm.realm.slug}`,
        )
      }
      regionEntrypointData={regionEntrypointData}
    />
  );
}

export const RegionAuctionsRouteContainer = withRouter(RouteContainer);
