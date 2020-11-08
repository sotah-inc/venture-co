import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { IOwnProps } from "../../components/entry-point/Professions";
import { ProfessionsContainer } from "../../containers/entry-point/Professions";

type Props = Readonly<WithRouterProps & IOwnProps>;

function RouteContainer({ router, entrypointData }: Props) {
  return (
    <ProfessionsContainer
      historyPush={(destination, asDest) => router.replace(destination, asDest)}
      entrypointData={entrypointData}
    />
  );
}

export const ProfessionsRouteContainer = withRouter(RouteContainer);
