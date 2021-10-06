import React from "react";

import { IRegionVersionRealmTuple } from "@sotah-inc/core";
import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { IOwnProps } from "../../components/entry-point/RegionEntrypoint";
import { RegionEntrypointContainer } from "../../containers/entry-point/RegionEntrypoint";
import { IResolveResult, resolveWrapper } from "../../util";
import { extractSlug } from "../../util/extract-slug";

type Props = Readonly<
  WithRouterProps &
    IOwnProps & {
      resolvePath: (tuple: IRegionVersionRealmTuple) => IResolveResult;
    }
>;

function RouteContainer({ router, regionEntrypointData, label, resolvePath }: Props) {
  const [nextGameVersion, nextRegionName] = extractSlug("slug", router.query);

  return (
    <RegionEntrypointContainer
      routeParams={{ region_name: nextRegionName, game_version: nextGameVersion }}
      redirectToRealm={resolveWrapper(resolvePath, router)}
      regionEntrypointData={regionEntrypointData}
      label={label}
    />
  );
}

export const RegionEntrypointRouteContainer = withRouter(RouteContainer);
