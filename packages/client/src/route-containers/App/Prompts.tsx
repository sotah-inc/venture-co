import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { PromptsContainer } from "../../containers/App/Prompts";

type Props = Readonly<WithRouterProps>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function RouteContainer(_props: Props) {
  return <PromptsContainer />;
}

export const PromptsRouteContainer = withRouter(RouteContainer);
