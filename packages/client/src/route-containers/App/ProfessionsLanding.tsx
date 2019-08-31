import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { IRouteProps } from "../../components/App/ProfessionsLanding";
import { ProfessionsLandingContainer } from "../../containers/App/ProfessionsLanding";

type Props = Readonly<IRouteProps & WithRouterProps>;

function RouteContainer({ router }: Props) {
  return (
    <ProfessionsLandingContainer
      routeParams={router.query}
      browseToProfessions={(region, realm) =>
        router.replace(`/data/${region.name}/${realm.slug}/professions`)
      }
    />
  );
}

export const ProfessionsLandingRouteContainer = withRouter(RouteContainer);
