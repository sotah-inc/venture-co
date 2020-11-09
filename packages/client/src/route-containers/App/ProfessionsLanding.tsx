import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { ProfessionsLandingContainer } from "../../containers/App/ProfessionsLanding";
import { toRealmProfessionPricelists } from "../../util";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return (
    <ProfessionsLandingContainer
      routeParams={router.query}
      browseToProfessions={(region, realm) => {
        const { asDest, url } = toRealmProfessionPricelists(region, realm);

        return router.replace(url, asDest);
      }}
    />
  );
}

export const ProfessionsLandingRouteContainer = withRouter(RouteContainer);
