import React from "react";

import { IRegionComposite } from "@sotah-inc/core";
import { WithRouterProps } from "next/dist/client/with-router";
import { NextRouter, withRouter } from "next/router";

import { IOwnProps } from "../../components/entry-point/RegionEntrypoint";
import { RegionEntrypointContainer } from "../../containers/entry-point/RegionEntrypoint";
import { IClientRealm } from "../../types/global";
import { extractSlug } from "../../util/extract-slug";

type Props = Readonly<
  WithRouterProps &
    IOwnProps & {
      resolvePath: (region: IRegionComposite, realm: IClientRealm) => ResolveResult;
    }
>;

interface ResolveResult {
  url: string;
  as: string;
}

type ResolveFunc = (...args: unknown[]) => ResolveResult;

function resolveWrapper(handler: ResolveFunc, router: NextRouter) {
  return async (...args: unknown[]): Promise<void> => {
    const { as, url } = handler(...args);

    await router.replace(url, as);
  };
}

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
