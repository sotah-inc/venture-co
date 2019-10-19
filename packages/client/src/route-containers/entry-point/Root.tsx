import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { IOwnProps } from "../../components/entry-point/Root";
import { RootContainer } from "../../containers/entry-point/Root";

type Props = Readonly<WithRouterProps & IOwnProps>;

function RouteContainer({ rootEntrypointData, router }: Props) {
  return (
    <RootContainer
      rootEntrypointData={rootEntrypointData}
      redirectToContent={() => router.replace("/content")}
    />
  );
}

export const RootRouteContainer = withRouter(RouteContainer);
