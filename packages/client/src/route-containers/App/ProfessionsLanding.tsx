import React from "react";

import { RouteComponentProps, withRouter } from "react-router-dom";

import { IRouteParams } from "../../components/App/ProfessionsLanding";
import { ProfessionsLandingContainer } from "../../containers/App/ProfessionsLanding";

type Props = Readonly<RouteComponentProps<IRouteParams>>;

function RouteContainer({ match: { params }, history }: Props) {
  return (
    <ProfessionsLandingContainer
      routeParams={params}
      browseToProfessions={(region, realm) =>
        history.replace(`/data/${region.name}/${realm.slug}/professions`)
      }
    />
  );
}

export const ProfessionsLandingRouteContainer = withRouter(RouteContainer);
