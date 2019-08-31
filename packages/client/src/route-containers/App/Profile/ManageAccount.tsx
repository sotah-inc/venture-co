import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { ManageAccountContainer } from "../../../containers/App/Profile/ManageAccount";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return (
    <ManageAccountContainer
      browseToHome={() => router.push("/")}
      browseToProfile={() => router.push("/profile")}
    />
  );
}

export const ManageAccountRouteContainer = withRouter(RouteContainer);
