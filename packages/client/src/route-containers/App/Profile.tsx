import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { Profile } from "../../components/App/Profile";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return <Profile browseToManageAccount={() => router.replace("/profile/manage-account")} />;
}

export const ProfileRouteContainer = withRouter(RouteContainer);
