import React from "react";

import { RouteComponentProps, withRouter } from "react-router-dom";

import { PromptsContainer } from "../../containers/App/Prompts";

type Props = Readonly<RouteComponentProps<{}>>;

function RouteContainer(_props: Props) {
  return <PromptsContainer />;
}

export const PromptsRouteContainer = withRouter(RouteContainer);
