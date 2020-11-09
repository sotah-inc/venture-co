import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { ProfessionsTreeContainer } from "../../../containers/entry-point/Professions/ProfessionsTree";
import { toRealmProfession } from "../../../util";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return (
    <ProfessionsTreeContainer
      browseToProfession={(region, realm, profession) => {
        const { url, asDest } = toRealmProfession(region, realm, profession);

        (async () => {
          await router.replace(`/${url}`, `/${asDest}`);
        })();
      }}
    />
  );
}

export const ProfessionsTreeRouteContainer = withRouter(RouteContainer);
