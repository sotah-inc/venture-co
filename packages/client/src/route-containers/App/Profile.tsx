import React from "react";

import { RouteComponentProps, withRouter } from "react-router-dom";

import { Profile } from "../../components/App/Profile";

type Props = Readonly<RouteComponentProps<{}>>;

function RouteContainer({ history }: Props) {
  return <Profile browseToManageAccount={() => history.replace("/profile/manage-account")} />;
}

export const ProfileRouteContainer = withRouter(RouteContainer);
