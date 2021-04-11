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
import { RecipePopover } from "../../../util/RecipePopover";

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
      return (
        <tr className="related-recipes">
          <td colSpan={3}>No recipe-ids for item {itemId}</td>
        </tr>
      );
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

    const boxShadow: string = index === 0 ? "none" : "inset 0 1px 0 0 rgba(255, 255, 255, 0.15)";

    if (currentRegion === null || currentRealm === null) {
      return (
        <tr className="related-recipes" key={index}>
          <td colSpan={3} style={{ boxShadow }}>
            No region or realm
          </td>
        </tr>
      );
    }

    const foundRecipe = itemsRecipes.recipes.find(v => v.id === recipeId);
    if (!foundRecipe) {
      return (
        <tr className="related-recipes" key={index}>
          <td colSpan={3} style={{ boxShadow }}>
            No recipe for recipe-id {recipeId}
          </td>
        </tr>
      );
    }

    const foundProfession = itemsRecipes.professions.find(v => v.id === foundRecipe.profession_id);
    if (!foundProfession) {
      return (
        <tr className="related-recipes" key={index}>
          <td colSpan={3} style={{ boxShadow }}>
            No profession for profession-id {foundRecipe.profession_id}
          </td>
        </tr>
      );
    }

    const foundSkillTier = itemsRecipes.skillTiers.find(v => v.id === foundRecipe.skilltier_id);
    if (!foundSkillTier) {
      return (
        <tr className="related-recipes" key={index}>
          <td colSpan={3} style={{ boxShadow }}>
            No skill-tier for skill-tier-id {foundRecipe.skilltier_id}
          </td>
        </tr>
      );
    }

    return (
      <tr className="related-recipes" key={index}>
        <td colSpan={3} style={{ boxShadow }}>
          <ButtonGroup>
            <Button
              rightIcon="chevron-right"
              icon={<img src={foundProfession.icon_url} className="skill-tier-icon" alt="" />}
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
            <RecipePopover
              recipe={{ id: foundRecipe.id, recipe: foundRecipe }}
              renderContent={() => {
                const recipeLabel =
                  foundRecipe.rank > 0
                    ? `${foundRecipe.name} (Rank ${foundRecipe.rank})`
                    : foundRecipe.name;

                return (
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
                    {recipeLabel}
                  </Button>
                );
              }}
              placement={"top"}
            />
          </ButtonGroup>
        </td>
        <td style={{ boxShadow: "inset 1px 0 0 0 rgba(255, 255, 255, 0.15)" }}>&nbsp;</td>
        <td style={{ boxShadow: "inset 1px 0 0 0 rgba(255, 255, 255, 0.15)" }}>&nbsp;</td>
        <td style={{ boxShadow: "inset 1px 0 0 0 rgba(255, 255, 255, 0.15)" }}>&nbsp;</td>
      </tr>
    );
  }
}
