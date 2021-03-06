import React, { useState } from "react";

import { Classes, MenuItem } from "@blueprintjs/core";
import { IItemRendererProps, ItemPredicate, Suggest } from "@blueprintjs/select";
import { IItemModifiers } from "@blueprintjs/select/src/common/itemRenderer";
import {
  IQueryRecipesResponseData,
  IShortProfession,
  IShortRecipe,
  IShortSkillTier,
  Locale,
  RecipeId,
} from "@sotah-inc/core";
import { debounce } from "lodash";

import { queryRecipes } from "../../api/professions";

type RecipeInputItem = {
  recipe_id: RecipeId;
  target: string;
  rank: number;
};

const RecipeSuggest = Suggest.ofType<RecipeInputItem>();

export interface IOwnProps {
  autoFocus?: boolean;
  idBlacklist?: RecipeId[];
  closeOnSelect?: boolean;
  idActiveList?: RecipeId[];
  initialResults?: IQueryRecipesResponseData;

  onSelect(profession: IShortProfession, skillTier: IShortSkillTier, recipe: IShortRecipe): void;
}

type Props = Readonly<IOwnProps>;

export function inputValueRenderer(recipe: IShortRecipe | null): string {
  if (recipe === null || recipe.id === 0) {
    return "n/a";
  }

  return recipe.name;
}

export function renderRecipeAsItemRendererText(recipe: IShortRecipe): JSX.Element {
  const label = recipe.rank > 0 ? `${recipe.name} (Rank ${recipe.rank})` : recipe.name;

  return (
    <>
      <img src={recipe.icon_url} className="recipe-icon" alt="" /> {label}
    </>
  );
}

function renderItemRendererTextContent(recipe: IShortRecipe | null) {
  if (recipe === null || recipe.id === 0) {
    return "n/a";
  }

  return renderRecipeAsItemRendererText(recipe);
}

function renderItemRendererText(recipe: IShortRecipe | null) {
  return <span className="recipe-input-menu-item">{renderItemRendererTextContent(recipe)}</span>;
}

const itemPredicate: ItemPredicate<RecipeInputItem> = (_: string, result: RecipeInputItem) => {
  return result.rank > -1;
};

export function renderItemLabel(skillTier: IShortSkillTier | null): string {
  return skillTier?.name ?? "";
}

export function resolveItemClassNames(
  recipe: IShortRecipe | null,
  modifiers: IItemModifiers,
  idActiveList?: RecipeId[],
): string[] {
  return [
    modifiers.active ? Classes.INTENT_PRIMARY : "",
    modifiers.active || (recipe !== null && idActiveList?.includes(recipe.id))
      ? Classes.ACTIVE
      : "",
  ].filter(v => v.length > 0);
}

interface IItemRendererOptions {
  results: IQueryRecipesResponseData;
  itemRendererProps: IItemRendererProps;

  idBlacklist?: RecipeId[];
  idActiveList?: RecipeId[];
}

export function itemRenderer(
  item: RecipeInputItem,
  opts: IItemRendererOptions,
): JSX.Element | null {
  const { handleClick, modifiers, index } = opts.itemRendererProps;

  const foundRecipe = opts.results.recipes.find(recipe => recipe.id === item.recipe_id);
  const foundSkillTier = opts.results.skillTiers.find(
    skillTier => skillTier.id === foundRecipe?.skilltier_id,
  );

  const disabled: boolean = (() => {
    if (typeof opts.idBlacklist === "undefined") {
      return false;
    }

    if (foundRecipe === undefined) {
      return true;
    }

    return opts.idBlacklist.includes(foundRecipe.id);
  })();

  if (!modifiers.matchesPredicate) {
    return null;
  }

  return (
    <MenuItem
      key={index}
      className={resolveItemClassNames(foundRecipe ?? null, modifiers, opts.idActiveList).join(" ")}
      onClick={handleClick}
      text={renderItemRendererText(foundRecipe ?? null)}
      label={renderItemLabel(foundSkillTier ?? null)}
      disabled={disabled}
    />
  );
}

export function RecipeInput(props: Props): JSX.Element {
  const { autoFocus, onSelect, closeOnSelect, idBlacklist, idActiveList, initialResults } = props;

  const [results, setResults] = useState<IQueryRecipesResponseData>(
    initialResults ?? {
      professions: [],
      queryResponse: { items: [] },
      recipes: [],
      skillTiers: [],
    },
  );

  return (
    <RecipeSuggest
      inputValueRenderer={v =>
        inputValueRenderer(results.recipes.find(recipe => recipe.id === v.recipe_id) ?? null)
      }
      itemRenderer={(item, itemRendererProps: IItemRendererProps) =>
        itemRenderer(item, { itemRendererProps, idBlacklist, idActiveList, results })
      }
      items={results.queryResponse.items}
      onItemSelect={v => {
        const foundRecipe = results.recipes.find(recipe => recipe.id === v.recipe_id);
        if (foundRecipe === undefined) {
          return;
        }

        const foundProfession = results.professions.find(
          profession => profession.id === foundRecipe.profession_id,
        );
        if (foundProfession === undefined) {
          return;
        }

        const foundSkillTier = results.skillTiers.find(
          skillTier => skillTier.id === foundRecipe.skilltier_id,
        );
        if (foundSkillTier === undefined) {
          return;
        }

        onSelect(foundProfession, foundSkillTier, foundRecipe);
      }}
      closeOnSelect={typeof closeOnSelect === "undefined" ? true : closeOnSelect}
      onQueryChange={debounce(async (filterValue: string) => {
        const res = await queryRecipes({ query: filterValue, locale: Locale.EnUS });
        if (res === null) {
          return;
        }

        setResults(res);
      }, 0.25 * 1000)}
      inputProps={{
        autoFocus,
        className: Classes.FILL,
        leftIcon: "search",
        type: "search",
      }}
      itemPredicate={itemPredicate}
      noResults={<em>No results found.</em>}
    />
  );
}
