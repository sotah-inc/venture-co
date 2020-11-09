import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { IOwnProps } from "../../components/entry-point/Professions";
import { ProfessionsContainer } from "../../containers/entry-point/Professions";

type Props = Readonly<WithRouterProps & IOwnProps>;

function RouteContainer({ entrypointData, realmEntrypointData }: Props) {
  return (
    <ProfessionsContainer
      entrypointData={entrypointData}
      realmEntrypointData={realmEntrypointData}
    />
  );
}

export const ProfessionsRouteContainer = withRouter(RouteContainer);
