import React, { useState } from "react";

import { Classes, H6, Menu, MenuItem } from "@blueprintjs/core";
import {
  IItemListRendererProps,
  IItemRendererProps,
  ItemListRenderer,
  ItemPredicate,
  Suggest,
} from "@blueprintjs/select";
import { IQueryGeneralItem, Locale } from "@sotah-inc/core";
import { debounce } from "lodash";

import { getItems } from "../../api/data";
import {
  inputValueRenderer as itemInputValueRenderer,
  renderItemAsItemRendererText,
} from "./ItemInput";

const GeneralItemSuggest = Suggest.ofType<IQueryGeneralItem>();

export interface IOwnProps {
  autoFocus?: boolean;
  closeOnSelect?: boolean;

  onSelect(item: IQueryGeneralItem): void;
}

type Props = Readonly<IOwnProps>;

function inputValueRenderer(result: IQueryGeneralItem): string {
  if (result.item.item !== null) {
    return itemInputValueRenderer(result.item.item);
  }

  return "n/a";
}

function renderItemRendererTextContent(item: IQueryGeneralItem) {
  if (item.item.item !== null) {
    return renderItemAsItemRendererText(item.item.item);
  }

  return "n/a";
}

function renderItemRendererText(item: IQueryGeneralItem) {
  return <span className="item-input-menu-item">{renderItemRendererTextContent(item)}</span>;
}

const itemPredicate: ItemPredicate<IQueryGeneralItem> = (_: string, result: IQueryGeneralItem) => {
  return result.rank > -1;
};

const itemListRenderer: ItemListRenderer<IQueryGeneralItem> = (
  params: IItemListRendererProps<IQueryGeneralItem>,
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

export function GeneralInput(props: Props) {
  const { autoFocus, onSelect, closeOnSelect } = props;

  const [results, setResults] = useState<IQueryGeneralItem[]>([]);

  return (
    <GeneralItemSuggest
      inputValueRenderer={inputValueRenderer}
      itemRenderer={(result, itemRendererProps: IItemRendererProps) => {
        const { handleClick, modifiers, index } = itemRendererProps;

        if (!modifiers.matchesPredicate) {
          return null;
        }

        const classNames = [
          modifiers.active ? Classes.INTENT_PRIMARY : "",
          modifiers.active ? Classes.ACTIVE : "",
        ].filter(v => v.length > 0);

        return (
          <MenuItem
            key={index}
            className={classNames.join(" ")}
            onClick={handleClick}
            text={renderItemRendererText(result)}
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
