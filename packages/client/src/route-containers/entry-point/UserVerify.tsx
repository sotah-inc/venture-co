import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { UserVerifyContainer } from "../../containers/entry-point/UserVerify";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return (
    <UserVerifyContainer
      redirectToLastPath={(pathname, asPath) => {
        (async () => {
          await router.replace(pathname, asPath);
        })();
      }}
    />
  );
}

export const UserVerifyRouteContainer = withRouter(RouteContainer);
