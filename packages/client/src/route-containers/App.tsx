import React from "react";

import { RouteComponentProps, withRouter } from "react-router-dom";

import { AppContainer } from "../containers/App";

interface IOwnProps extends RouteComponentProps<{}> {}

type Props = Readonly<IOwnProps>;

function RouteContainer(_props: Props) {
  return <AppContainer />;
}

export const AppRouteContainer = withRouter(RouteContainer);
