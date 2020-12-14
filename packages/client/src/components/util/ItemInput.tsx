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
import { IQueryItem, IShortItem, ItemId, Locale } from "@sotah-inc/core";
import { debounce } from "lodash";

import { getItems } from "../../api/items";
import { getItemIconUrl, getItemTextValue, qualityToColorClass } from "../../util";

const ItemSuggest = Suggest.ofType<IQueryItem<IShortItem>>();

export interface IOwnProps {
  autoFocus?: boolean;
  idBlacklist?: ItemId[];
  closeOnSelect?: boolean;
  idActiveList?: ItemId[];
  initialResults?: Array<IQueryItem<IShortItem>>;

  onSelect(item: IShortItem): void;
}

type Props = Readonly<IOwnProps>;

export function inputValueRenderer(item: IShortItem | null): string {
  if (item === null || item.id === 0) {
    return "n/a";
  }

  return getItemTextValue(item);
}

export function renderItemAsItemRendererText(item: IShortItem) {
  const itemText = getItemTextValue(item);
  const itemIconUrl = getItemIconUrl(item);

  if (itemIconUrl === null) {
    return itemText;
  }

  return (
    <>
      <img src={itemIconUrl} className="item-icon" alt="" /> {itemText}
    </>
  );
}

function renderItemRendererTextContent(item: IShortItem | null) {
  if (item === null || item.id === 0) {
    return "n/a";
  }

  return renderItemAsItemRendererText(item);
}

function renderItemRendererText(item: IShortItem | null) {
  return <span className="item-input-menu-item">{renderItemRendererTextContent(item)}</span>;
}

const itemPredicate: ItemPredicate<IQueryItem<IShortItem>> = (
  _: string,
  result: IQueryItem<IShortItem>,
) => {
  return result.rank > -1;
};

const itemListRenderer: ItemListRenderer<IQueryItem<IShortItem>> = (
  params: IItemListRendererProps<IQueryItem<IShortItem>>,
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

export function renderItemLabel(item: IShortItem | null): string {
  const hasFullItem = (item?.sotah_meta.normalized_name.en_US ?? "") !== "";

  return item && hasFullItem ? `I#${item.id}` : "";
}

export function resolveItemClassNames(
  item: IShortItem | null,
  modifiers: IItemModifiers,
  idActiveList?: ItemId[],
): string[] {
  const hasFullItem = (item?.sotah_meta.normalized_name.en_US ?? "") !== "";

  return [
    modifiers.active ? Classes.INTENT_PRIMARY : "",
    modifiers.active || (item && idActiveList?.includes(item.id)) ? Classes.ACTIVE : "",
    item && hasFullItem ? qualityToColorClass(item.quality.type) : "",
  ].filter(v => v.length > 0);
}

export function itemRenderer(
  item: IShortItem | null,
  itemRendererProps: IItemRendererProps,
  idBlacklist?: ItemId[],
  idActiveList?: ItemId[],
) {
  const { handleClick, modifiers, index } = itemRendererProps;

  const disabled: boolean = (() => {
    if (typeof idBlacklist === "undefined") {
      return false;
    }

    if (item === null) {
      return true;
    }

    return idBlacklist.includes(item.id);
  })();

  if (!modifiers.matchesPredicate) {
    return null;
  }

  return (
    <MenuItem
      key={index}
      className={resolveItemClassNames(item, modifiers, idActiveList).join(" ")}
      onClick={handleClick}
      text={renderItemRendererText(item)}
      label={renderItemLabel(item)}
      disabled={disabled}
    />
  );
}

export function ItemInput(props: Props) {
  const { autoFocus, onSelect, closeOnSelect, idBlacklist, idActiveList, initialResults } = props;

  const [results, setResults] = useState<Array<IQueryItem<IShortItem>>>(initialResults ?? []);

  return (
    <ItemSuggest
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
        const res = await getItems({ query: filterValue, locale: Locale.EnUS });
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
