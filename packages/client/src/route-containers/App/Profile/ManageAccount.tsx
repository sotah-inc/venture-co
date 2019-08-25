import React from "react";

import { RouteComponentProps, withRouter } from "react-router-dom";

import { ManageAccountContainer } from "../../../containers/App/Profile/ManageAccount";

type Props = Readonly<RouteComponentProps<{}>>;

function RouteContainer(props: Props) {
  const { history } = props;

  return (
    <ManageAccountContainer
      browseToHome={() => history.push("/")}
      browseToProfile={() => history.push("/profile")}
    />
  );
}

export const ManageAccountRouteContainer = withRouter(RouteContainer);
