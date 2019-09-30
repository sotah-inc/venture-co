import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { RegionContainer } from "../../../containers/App/Data/Region";
import { extractString } from "../../../util";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return (
    <RegionContainer
      routeParams={{ region_name: extractString("region_name", router.query) }}
      browseToRealmData={(region, realm) => router.push(`/data/${region.name}/${realm.slug}`)}
    />
  );
}

export const RegionRouteContainer = withRouter(RouteContainer);
