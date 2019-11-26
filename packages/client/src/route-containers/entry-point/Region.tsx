import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";
import React from "react";

import { IOwnProps } from "../../components/entry-point/Region";
import { RegionContainer } from "../../containers/entry-point/Region";
import { extractString } from "../../util";

type Props = Readonly<WithRouterProps & IOwnProps>;

function RouteContainer({ router, regionEntrypointData }: Props) {
  return (
    <RegionContainer
      routeParams={{ region_name: extractString("region_name", router.query) }}
      browseToRealmData={(region, realm) => router.replace(`/data/${region.name}/${realm.slug}`)}
      regionEntrypointData={regionEntrypointData}
    />
  );
}

export const RegionRouteContainer = withRouter(RouteContainer);
