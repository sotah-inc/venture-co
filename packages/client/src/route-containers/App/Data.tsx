import React from "react";

import { RouteComponentProps, withRouter } from "react-router-dom";

import { DataContainer } from "../../containers/App/Data";

type Props = Readonly<RouteComponentProps<{}>>;

function RouteContainer({ history }: Props) {
  return <DataContainer redirectToRegion={region => history.replace(`/data/${region.name}`)} />;
}

export const DataRouteContainer = withRouter(RouteContainer);
