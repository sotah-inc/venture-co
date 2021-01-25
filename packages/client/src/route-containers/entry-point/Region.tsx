import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";
import React from "react";

import { IOwnProps } from "../../components/entry-point/Region";
import { RegionContainer } from "../../containers/entry-point/Region";
import { extractSlug } from "../../util/extract-slug";

type Props = Readonly<WithRouterProps & IOwnProps>;

function RouteContainer({ router, regionEntrypointData }: Props) {
  const [nextRegionName] = extractSlug("slug", router.query);

  return (
    <RegionContainer
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

export const RegionRouteContainer = withRouter(RouteContainer);
