import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { IOwnProps } from "../../../components/App/Topbar/VersionToggle";
import { VersionToggleContainer } from "../../../containers/App/Topbar/VersionToggle";

type Props = Readonly<WithRouterProps & IOwnProps>;

function RouteContainer({ router, buttonProps, resolveRouteConfig, exactOrPrefix }: Props) {
  return (
    <VersionToggleContainer
      redirectToVersionDestination={(url, asDest) => {
        (async () => {
          await router.replace(url, asDest);
        })();
      }}
      buttonProps={buttonProps}
      resolveRouteConfig={resolveRouteConfig}
      locationAsPath={router.asPath}
      exactOrPrefix={exactOrPrefix}
    />
  );
}

export const VersionToggleRouteContainer = withRouter(RouteContainer);
