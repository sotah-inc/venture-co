import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { IOwnProps } from "../../components/entry-point/Professions";
import { ProfessionsContainer } from "../../containers/entry-point/Professions";
import { toRealmCategoryRecipe, toRealmProfession, toRealmSkillTier } from "../../util";

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
      redirectToSkillTier={(region, realm, profession, skillTier) => {
        const { url, asDest } = toRealmSkillTier(region, realm, profession, skillTier);

        (async () => {
          await router.replace(`/${url}`, `/${asDest}`);
        })();
      }}
      redirectToRecipe={(region, realm, profession, skillTier, recipe) => {
        const { url, asDest } = toRealmCategoryRecipe(region, realm, profession, skillTier, recipe);

        (async () => {
          await router.replace(`/${url}`, `/${asDest}`);
        })();
      }}
    />
  );
}

export const ProfessionsRouteContainer = withRouter(RouteContainer);
