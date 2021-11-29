import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { VersionToggleContainer } from "../../../containers/App/Topbar/VersionToggle";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return (
    <VersionToggleContainer
      redirectToVersionDestination={(url, asDest) => {
        (async () => {
          await router.replace(url, asDest);
        })();
      }}
    />
  );
}

export const VersionToggleRouteContainer = withRouter(RouteContainer);
