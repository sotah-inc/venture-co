import React from "react";

import { IRegionComposite } from "@sotah-inc/core";
import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { IOwnProps } from "../../components/entry-point/RegionEntrypoint";
import { RegionEntrypointContainer } from "../../containers/entry-point/RegionEntrypoint";
import { IClientRealm } from "../../types/global";
import { ResolveResult, resolveWrapper } from "../../util";
import { extractSlug } from "../../util/extract-slug";

type Props = Readonly<
  WithRouterProps &
    IOwnProps & {
      resolvePath: (region: IRegionComposite, realm: IClientRealm) => ResolveResult;
    }
>;

function RouteContainer({ router, regionEntrypointData, label, resolvePath }: Props) {
  const [nextRegionName] = extractSlug("slug", router.query);

  return (
    <RegionEntrypointContainer
      routeParams={{ region_name: nextRegionName }}
      redirectToRealm={resolveWrapper(resolvePath, router)}
      regionEntrypointData={regionEntrypointData}
      label={label}
    />
  );
}

export const RegionEntrypointRouteContainer = withRouter(RouteContainer);
