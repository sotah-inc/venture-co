import React from "react";

import { Button, ButtonGroup } from "@blueprintjs/core";
import {
  IGetItemsRecipesResponseData,
  IRegionComposite,
  IShortProfession,
  IShortSkillTier,
  IShortSkillTierCategoryRecipe,
  ItemId,
  RecipeId,
} from "@sotah-inc/core";

import { IClientRealm } from "../../../../types/global";

export interface IStateProps {
  currentRealm: IClientRealm | null;
  currentRegion: IRegionComposite | null;
  itemsRecipes: IGetItemsRecipesResponseData;
}

export interface IRouteProps {
  browseToSkillTier: (
    region: IRegionComposite,
    realm: IClientRealm,
    profession: IShortProfession,
    skillTier: IShortProfession["skilltiers"][0],
  ) => void;
  browseToRecipe: (
    region: IRegionComposite,
    realm: IClientRealm,
    profession: IShortProfession,
    skillTier: IShortSkillTier,
    recipe: IShortSkillTierCategoryRecipe,
  ) => void;
}

export interface IOwnProps {
  itemId: ItemId;
}

type Props = Readonly<IStateProps & IOwnProps & IRouteProps>;

export class RelatedRecipes extends React.Component<Props> {
  public render(): React.ReactNode {
    const { itemId, itemsRecipes } = this.props;

    const foundRecipeIds = itemsRecipes.itemsRecipeIds[itemId];
    if (foundRecipeIds === undefined || foundRecipeIds === null) {
      return null;
    }

    return foundRecipeIds.map((recipeId, index) => this.renderRecipe(index, recipeId));
  }

  private renderRecipe(index: number, recipeId: RecipeId) {
    const {
      currentRegion,
      currentRealm,
      itemsRecipes,
      browseToSkillTier,
      browseToRecipe,
    } = this.props;

    if (currentRegion === null || currentRealm === null) {
      return null;
    }

    const foundRecipe = itemsRecipes.recipes.find(v => v.id === recipeId);
    if (!foundRecipe) {
      return null;
    }

    const foundProfession = itemsRecipes.professions.find(v => v.id === foundRecipe.profession_id);
    if (!foundProfession) {
      return null;
    }

    const foundSkillTier = itemsRecipes.skillTiers.find(v => v.id === foundRecipe.skilltier_id);
    if (!foundSkillTier) {
      return null;
    }

    const boxShadow: string = index === 0 ? "none" : "inset 0 1px 0 0 rgba(255, 255, 255, 0.15)";

    return (
      <tr className="related-profession-pricelists" key={index}>
        <td colSpan={3} style={{ boxShadow }}>
          <ButtonGroup>
            <Button
              rightIcon="chevron-right"
              minimal={true}
              small={true}
              onClick={() =>
                browseToSkillTier(currentRegion, currentRealm, foundProfession, {
                  id: foundSkillTier.id,
                  is_primary: false,
                  name: foundSkillTier.name,
                })
              }
            >
              {foundSkillTier.name}
            </Button>
            <Button
              icon={<img src={foundRecipe.icon_url} className="recipe-icon" alt="" />}
              minimal={true}
              small={true}
              onClick={() =>
                browseToRecipe(currentRegion, currentRealm, foundProfession, foundSkillTier, {
                  id: foundRecipe.id,
                  recipe: foundRecipe,
                })
              }
            >
              {foundRecipe.name}
            </Button>
          </ButtonGroup>
        </td>
        <td style={{ boxShadow: "inset 1px 0 0 0 rgba(255, 255, 255, 0.15)" }}>&nbsp;</td>
        <td style={{ boxShadow: "inset 1px 0 0 0 rgba(255, 255, 255, 0.15)" }}>&nbsp;</td>
        <td style={{ boxShadow: "inset 1px 0 0 0 rgba(255, 255, 255, 0.15)" }}>&nbsp;</td>
      </tr>
    );
  }
}
