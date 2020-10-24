import { IItemModifiers } from "@blueprintjs/select/src/common/itemRenderer";
import React, { useState } from "react";

import { Classes, H6, Menu, MenuItem } from "@blueprintjs/core";
import {
  IItemListRendererProps,
  IItemRendererProps,
  ItemListRenderer,
  ItemPredicate,
  Suggest,
} from "@blueprintjs/select";
import { IQueryItem, IShortPet, ItemId, Locale, PetId } from "@sotah-inc/core";
import { debounce } from "lodash";

import { getPets } from "../../api/data";
import { getPetIconUrl } from "../../util";

const PetSuggest = Suggest.ofType<IQueryItem<IShortPet>>();

export interface IOwnProps {
  autoFocus?: boolean;
  idBlacklist?: PetId[];
  closeOnSelect?: boolean;
  idActiveList?: PetId[];
  initialResults?: Array<IQueryItem<IShortPet>>;

  onSelect(pet: IShortPet): void;
}

type Props = Readonly<IOwnProps>;

export function inputValueRenderer(pet: IShortPet | null): string {
  if (pet === null || pet.id === 0) {
    return "n/a";
  }

  return pet.name;
}

export function renderPetAsItemRendererText(pet: IShortPet) {
  const petIconUrl = getPetIconUrl(pet);

  return (
    <>
      <img src={petIconUrl} className="pet-icon" alt="" /> {pet.name}
    </>
  );
}

function renderPetRendererTextContent(pet: IShortPet | null) {
  if (pet === null || pet.id === 0) {
    return "n/a";
  }

  return renderPetAsItemRendererText(pet);
}

function renderItemRendererText(pet: IShortPet | null) {
  return <span className="pet-input-menu-item">{renderPetRendererTextContent(pet)}</span>;
}

const itemPredicate: ItemPredicate<IQueryItem<IShortPet>> = (
  _: string,
  result: IQueryItem<IShortPet>,
) => {
  return result.rank > -1;
};

const itemListRenderer: ItemListRenderer<IQueryItem<IShortPet>> = (
  params: IItemListRendererProps<IQueryItem<IShortPet>>,
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
    <Menu ulRef={itemsParentRef} className="item-input-menu">
      <li>
        <H6>Queried Results</H6>
      </li>
      {renderedItems}
    </Menu>
  );
};

export function renderItemLabel(_pet: IShortPet | null): string {
  return "";
}

export function resolvePetClassNames(
  pet: IShortPet | null,
  modifiers: IItemModifiers,
  idActiveList?: PetId[],
): string[] {
  return [
    modifiers.active ? Classes.INTENT_PRIMARY : "",
    modifiers.active || (pet && idActiveList?.includes(pet.id)) ? Classes.ACTIVE : "",
  ].filter(v => v.length > 0);
}

export function itemRenderer(
  pet: IShortPet | null,
  itemRendererProps: IItemRendererProps,
  idBlacklist?: ItemId[],
  idActiveList?: ItemId[],
) {
  const { handleClick, modifiers, index } = itemRendererProps;

  const disabled: boolean = (() => {
    if (typeof idBlacklist === "undefined") {
      return false;
    }

    if (pet === null) {
      return true;
    }

    return idBlacklist.includes(pet.id);
  })();

  if (!modifiers.matchesPredicate) {
    return null;
  }

  return (
    <MenuItem
      key={index}
      className={resolvePetClassNames(pet, modifiers, idActiveList).join(" ")}
      onClick={handleClick}
      text={renderItemRendererText(pet)}
      label={renderItemLabel(pet)}
      disabled={disabled}
    />
  );
}

export function PetInput(props: Props) {
  const { autoFocus, onSelect, closeOnSelect, idActiveList, idBlacklist, initialResults } = props;

  const [results, setResults] = useState<Array<IQueryItem<IShortPet>>>(initialResults ?? []);

  return (
    <PetSuggest
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
        const res = await getPets({ query: filterValue, locale: Locale.EnUS });
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
