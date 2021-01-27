import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { BaseProfessionsContainer } from "../../containers/entry-point/BaseProfessions";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return (
    <BaseProfessionsContainer
      redirectToRegion={region =>
        router.replace("/professions/[region_name]", `/professions/${region.config_region.name}`)
      }
    />
  );
}

export const BaseProfessionsRouteContainer = withRouter(RouteContainer);
