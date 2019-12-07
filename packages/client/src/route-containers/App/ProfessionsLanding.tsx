import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { ProfessionsLandingContainer } from "../../containers/App/ProfessionsLanding";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return (
    <ProfessionsLandingContainer
      routeParams={router.query}
      browseToProfessions={(region, realm) =>
        router.replace(
          "/data/[region_name]/[realm_slug]/professions",
          `/data/${region.name}/${realm.slug}/professions`,
        )
      }
    />
  );
}

export const ProfessionsLandingRouteContainer = withRouter(RouteContainer);
