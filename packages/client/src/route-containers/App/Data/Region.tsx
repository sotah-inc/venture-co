import * as React from "react";

import { RouteComponentProps, withRouter } from "react-router-dom";

import { IRouteParams } from "../../../components/App/Data/Region";
import { RegionContainer } from "../../../containers/App/Data/Region";

type Props = Readonly<RouteComponentProps<IRouteParams>>;

function RouteContainer({ match: { params }, history }: Props) {
  return (
    <RegionContainer
      routeParams={params}
      browseToRealmData={(region, realm) => history.push(`/data/${region.name}/${realm.slug}`)}
    />
  );
}

export const RegionRouteContainer = withRouter(RouteContainer);
