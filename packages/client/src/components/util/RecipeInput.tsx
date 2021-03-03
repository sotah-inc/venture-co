import React, { useState } from "react";

import { Classes, H6, Menu, MenuItem } from "@blueprintjs/core";
import {
  IItemListRendererProps,
  IItemRendererProps,
  ItemListRenderer,
  ItemPredicate,
  Suggest,
} from "@blueprintjs/select";
import { IItemModifiers } from "@blueprintjs/select/src/common/itemRenderer";
import { IQueryItem, IShortRecipe, Locale, RecipeId } from "@sotah-inc/core";
import { debounce } from "lodash";

import { queryRecipes } from "../../api/professions";

const RecipeSuggest = Suggest.ofType<IQueryItem<IShortRecipe>>();

export interface IOwnProps {
  autoFocus?: boolean;
  idBlacklist?: RecipeId[];
  closeOnSelect?: boolean;
  idActiveList?: RecipeId[];
  initialResults?: Array<IQueryItem<IShortRecipe>>;

  onSelect(recipe: IShortRecipe): void;
}

type Props = Readonly<IOwnProps>;

export function inputValueRenderer(recipe: IShortRecipe | null): string {
  if (recipe === null || recipe.id === 0) {
    return "n/a";
  }

  return recipe.name;
}

export function renderRecipeAsItemRendererText(recipe: IShortRecipe): JSX.Element {
  return (
    <>
      <img src={recipe.icon_url} className="recipe-icon" alt="" /> {recipe.name}
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

const itemPredicate: ItemPredicate<IQueryItem<IShortRecipe>> = (
  _: string,
  result: IQueryItem<IShortRecipe>,
) => {
  return result.rank > -1;
};

const itemListRenderer: ItemListRenderer<IQueryItem<IShortRecipe>> = (
  params: IItemListRendererProps<IQueryItem<IShortRecipe>>,
) => {
  const { items, itemsParentRef, renderItem } = params;
  const renderedItems = items.map(renderItem).filter(renderedItem => renderedItem !== null);
  if (renderedItems.length === 0) {
    return (
      <Menu ulRef={itemsParentRef}>
        <li>
          <H6>Queried Results</H6>
        </li>
        <li>
          <em>No results found.</em>
        </li>
      </Menu>
    );
  }

  return (
    <Menu ulRef={itemsParentRef} className="recipe-input-menu">
      <li>
        <H6>Queried Results</H6>
      </li>
      {renderedItems}
    </Menu>
  );
};

export function renderItemLabel(recipe: IShortRecipe | null): string {
  if (recipe === null) {
    return "";
  }

  return `R#${recipe.id}`;
}

export function resolveItemClassNames(
  recipe: IShortRecipe | null,
  modifiers: IItemModifiers,
  idActiveList?: RecipeId[],
): string[] {
  return [
    modifiers.active ? Classes.INTENT_PRIMARY : "",
    modifiers.active || (recipe && idActiveList?.includes(recipe.id)) ? Classes.ACTIVE : "",
  ].filter(v => v.length > 0);
}

export function itemRenderer(
  recipe: IShortRecipe | null,
  itemRendererProps: IItemRendererProps,
  idBlacklist?: RecipeId[],
  idActiveList?: RecipeId[],
): JSX.Element | null {
  const { handleClick, modifiers, index } = itemRendererProps;

  const disabled: boolean = (() => {
    if (typeof idBlacklist === "undefined") {
      return false;
    }

    if (recipe === null) {
      return true;
    }

    return idBlacklist.includes(recipe.id);
  })();

  if (!modifiers.matchesPredicate) {
    return null;
  }

  return (
    <MenuItem
      key={index}
      className={resolveItemClassNames(recipe, modifiers, idActiveList).join(" ")}
      onClick={handleClick}
      text={renderItemRendererText(recipe)}
      label={renderItemLabel(recipe)}
      disabled={disabled}
    />
  );
}

export function RecipeInput(props: Props): JSX.Element {
  const { autoFocus, onSelect, closeOnSelect, idBlacklist, idActiveList, initialResults } = props;

  const [results, setResults] = useState<Array<IQueryItem<IShortRecipe>>>(initialResults ?? []);

  return (
    <RecipeSuggest
      inputValueRenderer={v => inputValueRenderer(v.item)}
      itemRenderer={(result, itemRendererProps: IItemRendererProps) => {
        return itemRenderer(result.item, itemRendererProps, idBlacklist, idActiveList);
      }}
      items={results}
      onItemSelect={v => {
        if (v.item === null) {
          return;
        }

        onSelect(v.item);
      }}
      closeOnSelect={typeof closeOnSelect === "undefined" ? true : closeOnSelect}
      onQueryChange={debounce(async (filterValue: string) => {
        const res = await queryRecipes({ query: filterValue, locale: Locale.EnUS });
        if (res === null) {
          return;
        }

        setResults(res.items);
      }, 0.25 * 1000)}
      inputProps={{
        autoFocus,
        className: Classes.FILL,
        leftIcon: "search",
        type: "search",
      }}
      itemPredicate={itemPredicate}
      itemListRenderer={itemListRenderer}
    />
  );
}
