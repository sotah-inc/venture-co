import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import {
  IOwnProps,
} from "../../../../components/entry-point/AuctionList/AuctionTable/RelatedRecipes";
import {
  RelatedRecipesContainer,
} from "../../../../containers/entry-point/AuctionList/AuctionTable/RelatedRecipes";
import { toRealmCategoryRecipe, toRealmSkillTier } from "../../../../util";

type Props = Readonly<WithRouterProps & IOwnProps>;

function RouteContainer({ router, itemId }: Props) {
  return (
    <RelatedRecipesContainer
      itemId={itemId}
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

export const RelatedRecipesRouteContainer = withRouter(RouteContainer);
