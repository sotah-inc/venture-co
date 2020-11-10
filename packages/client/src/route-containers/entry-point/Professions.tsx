import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { IOwnProps } from "../../components/entry-point/Professions";
import { ProfessionsContainer } from "../../containers/entry-point/Professions";
import { toRealmProfession } from "../../util";

type Props = Readonly<WithRouterProps & IOwnProps>;

function RouteContainer({ entrypointData, realmEntrypointData, router }: Props) {
  return (
    <ProfessionsContainer
      entrypointData={entrypointData}
      realmEntrypointData={realmEntrypointData}
      redirectToProfession={(region, realm, profession) => {
        const { url, asDest } = toRealmProfession(region, realm, profession);

        (async () => {
          await router.replace(`/${url}`, `/${asDest}`);
        })();
      }}
    />
  );
}

export const ProfessionsRouteContainer = withRouter(RouteContainer);
