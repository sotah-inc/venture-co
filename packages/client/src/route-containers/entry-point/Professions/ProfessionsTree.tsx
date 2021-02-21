import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import {
  ProfessionsTreeContainer,
} from "../../../containers/entry-point/Professions/ProfessionsTree";
import { toRealmCategoryRecipe, toRealmProfession, toRealmSkillTier } from "../../../util";

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
      browseToSkillTier={(region, realm, profession, skillTier) => {
        const { url, asDest } = toRealmSkillTier(region, realm, profession, skillTier);

        (async () => {
          await router.replace(`/${url}`, `/${asDest}`);
        })();
      }}
      browseToRecipe={(region, realm, profession, skillTier, recipe) => {
        const { url, asDest } = toRealmCategoryRecipe(region, realm, profession, skillTier, recipe);

        (async () => {
          await router.replace(`/${url}`, `/${asDest}`);
        })();
      }}
    />
  );
}

export const ProfessionsTreeRouteContainer = withRouter(RouteContainer);
