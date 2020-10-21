import React, { useState } from "react";

import { Classes, H6, Menu, MenuItem } from "@blueprintjs/core";
import { IItemListRendererProps, IItemRendererProps, Suggest } from "@blueprintjs/select";
import { IQueryItem, IQueryItemWithId, Locale } from "@sotah-inc/core";
import { debounce } from "lodash";

import { getItems } from "../../api/data";
import { qualityToColorClass } from "../../util";

interface IOwnProps<T extends IQueryItemWithId> {
  autoFocus?: boolean;
  idBlacklist?: number[];
  closeOnSelect?: boolean;
  idActiveList?: number[];
  initialResults?: Array<IQueryItem<T>>;

  onSelect(item: T): void;
  inputValueRenderer(result: IQueryItem<T>): string;
  renderLabel(result: IQueryItem<T>): string | undefined;
  renderText(result: IQueryItem<T>): React.ReactNode;
}

type Props<T extends IQueryItemWithId> = Readonly<IOwnProps<T>>;

export function renderQuerySuggest<T extends IQueryItemWithId>(props: Props<T>) {
  const {
    inputValueRenderer,
    idBlacklist,
    renderLabel,
    idActiveList,
    renderText,
    onSelect,
  } = props;

  const SuggestElement = Suggest.ofType<IQueryItem<T>>();

  return (
    <SuggestElement
      inputValueRenderer={inputValueRenderer}
      itemRenderer={(result, itemRendererProps: IItemRendererProps) => {
        const { handleClick, modifiers, index } = itemRendererProps;
        const { item } = result;

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

        const classNames = [
          modifiers.active ? Classes.INTENT_PRIMARY : "",
          modifiers.active || (item && idActiveList?.includes(item.id)) ? Classes.ACTIVE : "",
        ].filter(v => v.length > 0);

        return (
          <MenuItem
            key={index}
            className={classNames.join(" ")}
            onClick={handleClick}
            text={renderText(result)}
            label={renderLabel(result)}
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

function itemPredicate<T extends IQueryItemWithId>(_: string, result: IQueryItem<T>) {
  return result.rank > -1;
}

function itemListRenderer<T extends IQueryItemWithId>(
  params: IItemListRendererProps<IQueryItem<T>>,
) {
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
}

export function QueryInput<T extends IQueryItemWithId>(props: Props<T>) {
  const { autoFocus, onSelect, closeOnSelect, initialResults, inputValueRenderer } = props;

  const [results, setResults] = useState<Array<IQueryItem<T>>>(initialResults ?? []);

  return <QuerySuggest />;
}
