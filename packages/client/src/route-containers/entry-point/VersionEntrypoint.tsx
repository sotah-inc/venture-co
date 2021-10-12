import React from "react";

import { RegionVersionTuple } from "@sotah-inc/core";
import log from "loglevel";
import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { IOwnProps } from "../../components/entry-point/VersionEntrypoint";
import { VersionEntrypointContainer } from "../../containers/entry-point/VersionEntrypoint";
// import { resolveWrapper } from "../../util";

type Props = Readonly<
  WithRouterProps &
    IOwnProps & {
      resolvePath: (tuple: RegionVersionTuple) => { url: string; as: string };
    }
>;

function RouteContainer({
  router: _router,
  label,
  resolvePath: _resolvePath,
  versionEntrypointData,
}: Props) {
  return (
    <VersionEntrypointContainer
      // redirectToRegion={resolveWrapper(resolvePath, router)}
      redirectToRegion={tuple => {
        log.info("redirectToRegion()", { tuple });
      }}
      versionEntrypointData={versionEntrypointData}
      label={label}
    />
  );
}

export const VersionEntrypointRouteContainer = withRouter(RouteContainer);
