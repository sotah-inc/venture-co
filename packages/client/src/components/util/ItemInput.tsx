import React, { useState } from "react";

import { Classes, H6, Menu, MenuItem } from "@blueprintjs/core";
import {
  IItemListRendererProps,
  IItemRendererProps,
  ItemListRenderer,
  ItemPredicate,
  Suggest,
} from "@blueprintjs/select";
import { IItem, IQueryItemsItem, ItemId, Locale } from "@sotah-inc/core";
import { debounce } from "lodash";

import { getItems } from "../../api/data";
import { getItemIconUrl, getItemTextValue, qualityToColorClass } from "../../util";

const ItemSuggest = Suggest.ofType<IQueryItemsItem>();

export interface IOwnProps {
  autoFocus?: boolean;
  itemIdBlacklist?: ItemId[];
  closeOnSelect?: boolean;
  itemIdActiveList?: ItemId[];

  onSelect(item: IItem): void;
}

type Props = Readonly<IOwnProps>;

const inputValueRenderer = (result: IQueryItemsItem): string => {
  if (result.item === null || result.item.blizzard_meta.id === 0) {
    return "n/a";
  }

  return getItemTextValue(result.item);
};

const renderItemAsItemRendererText = (item: IItem) => {
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
};

const renderItemRendererTextContent = (item: IItem | null) => {
  if (item === null || item.blizzard_meta.id === 0) {
    return "n/a";
  }

  return renderItemAsItemRendererText(item);
};

const renderItemRendererText = (item: IItem | null) => {
  return <span className="item-input-menu-item">{renderItemRendererTextContent(item)}</span>;
};

const itemPredicate: ItemPredicate<IQueryItemsItem> = (_: string, result: IQueryItemsItem) => {
  return result.rank > -1;
};

const itemListRenderer: ItemListRenderer<IQueryItemsItem> = (
  params: IItemListRendererProps<IQueryItemsItem>,
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

export function ItemInput(props: Props) {
  const { autoFocus, onSelect, closeOnSelect, itemIdBlacklist, itemIdActiveList } = props;

  const [results, setResults] = useState<IQueryItemsItem[]>([]);

  return (
    <ItemSuggest
      inputValueRenderer={inputValueRenderer}
      itemRenderer={(result, itemRendererProps: IItemRendererProps) => {
        const { handleClick, modifiers, index } = itemRendererProps;
        const { item } = result;

        const disabled: boolean = (() => {
          if (typeof itemIdBlacklist === "undefined") {
            return false;
          }

          if (item === null) {
            return true;
          }

          return itemIdBlacklist.includes(item.blizzard_meta.id);
        })();

        if (!modifiers.matchesPredicate) {
          return null;
        }

        const hasFullItem = (item?.sotah_meta.normalized_name.en_US ?? "") !== "";
        const label = item && hasFullItem ? `#${item.blizzard_meta.id}` : "";
        const classNames = [
          modifiers.active ? Classes.INTENT_PRIMARY : "",
          modifiers.active || (item && itemIdActiveList?.includes(item.blizzard_meta.id))
            ? Classes.ACTIVE
            : "",
          item && hasFullItem ? qualityToColorClass(item.blizzard_meta.quality.type) : "",
        ].filter(v => v.length > 0);

        return (
          <MenuItem
            key={index}
            className={classNames.join(" ")}
            onClick={handleClick}
            text={renderItemRendererText(item)}
            label={label}
            disabled={disabled}
          />
        );
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
