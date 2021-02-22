import React, { useState } from "react";

import { Classes, H6, Menu } from "@blueprintjs/core";
import {
  IItemListRendererProps,
  IItemRendererProps,
  ItemListRenderer,
  ItemPredicate,
  Suggest,
} from "@blueprintjs/select";
import { IQueryGeneralItem, Locale } from "@sotah-inc/core";
import { debounce } from "lodash";

import { queryGeneral } from "../../api/data";
import {
  inputValueRenderer as itemInputValueRenderer,
  itemRenderer as itemItemRenderer,
} from "./ItemInput";
import {
  inputValueRenderer as petInputValueRenderer,
  itemRenderer as petItemRenderer,
} from "./PetInput";

const GeneralItemSuggest = Suggest.ofType<IQueryGeneralItem>();

export interface IOwnProps {
  autoFocus?: boolean;
  closeOnSelect?: boolean;
  initialResults?: IQueryGeneralItem[];

  onSelect(item: IQueryGeneralItem): void;
}

type Props = Readonly<IOwnProps>;

function inputValueRenderer(result: IQueryGeneralItem): string {
  if (result.item.item !== null) {
    return itemInputValueRenderer(result.item.item);
  }

  if (result.item.pet !== null) {
    return petInputValueRenderer(result.item.pet);
  }

  return "n/a";
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

export function itemRenderer(
  result: IQueryGeneralItem,
  itemRendererProps: IItemRendererProps,
): JSX.Element | null {
  if (result.item.item !== null) {
    return itemItemRenderer(result.item.item, itemRendererProps);
  }

  if (result.item.pet !== null) {
    return petItemRenderer(result.item.pet, itemRendererProps);
  }

  return null;
}

export function GeneralInput(props: Props): JSX.Element {
  const { autoFocus, onSelect, closeOnSelect, initialResults } = props;

  const [results, setResults] = useState<IQueryGeneralItem[]>(initialResults ?? []);

  return (
    <GeneralItemSuggest
      inputValueRenderer={inputValueRenderer}
      itemRenderer={(result, itemRendererProps: IItemRendererProps) => {
        return itemRenderer(result, itemRendererProps);
      }}
      items={results}
      onItemSelect={onSelect}
      closeOnSelect={typeof closeOnSelect === "undefined" ? true : closeOnSelect}
      onQueryChange={debounce(async (filterValue: string) => {
        const res = await queryGeneral({ query: filterValue, locale: Locale.EnUS });
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
