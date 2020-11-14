import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { ActionBarContainer } from "../../../containers/entry-point/Professions/ActionBar";
import {
  toRealmProfession,
  toRealmProfessions,
  toRealmRecipe,
  toRealmSkillTier,
} from "../../../util";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return (
    <ActionBarContainer
      browseToRealm={(region, realm) => {
        const { url, asDest } = toRealmProfessions(region, realm);

        (async () => {
          await router.replace(`/${url}`, `/${asDest}`);
        })();
      }}
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
        const { url, asDest } = toRealmRecipe(region, realm, profession, skillTier, recipe);

        (async () => {
          await router.replace(`/${url}`, `/${asDest}`);
        })();
      }}
    />
  );
}

export const ActionBarRouteContainer = withRouter(RouteContainer);
