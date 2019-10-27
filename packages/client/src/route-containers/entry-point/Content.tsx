import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { IOwnProps } from "../../components/entry-point/Content";
import { ContentContainer } from "../../containers/entry-point/Content";

type Props = Readonly<WithRouterProps & IOwnProps>;

function RouteContainer({ rootEntrypointData, router }: Props) {
  return (
    <ContentContainer
      rootEntrypointData={rootEntrypointData}
      redirectToNews={() => router.replace("/content/news")}
    />
  );
}

export const ContentRouteContainer = withRouter(RouteContainer);
