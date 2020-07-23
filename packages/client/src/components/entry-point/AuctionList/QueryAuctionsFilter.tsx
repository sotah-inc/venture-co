import React from "react";

import {
  Alignment,
  Callout,
  Classes,
  H4,
  H6,
  Intent,
  Menu,
  MenuItem,
  Navbar,
  NavbarGroup,
  Spinner,
  Switch,
  Tag,
} from "@blueprintjs/core";
import {
  IItemListRendererProps,
  IItemRendererProps,
  ItemListRenderer,
  ItemPredicate,
  ItemRenderer,
  Suggest,
} from "@blueprintjs/select";
import { IItem, IQueryItemsItem, IRegionComposite, IStatusRealm } from "@sotah-inc/core";
import { debounce } from "lodash";

import { IGetAuctionsOptions } from "../../../api/data";
import { FetchLevel } from "../../../types/main";
import {
  getItemIconUrl,
  getItemTextValue,
  getSelectedResultIndex,
  qualityToColorClass,
} from "../../../util";

const QueryAuctionResultSuggest = Suggest.ofType<IQueryItemsItem>();

export interface IStateProps {
  queryAuctionsLevel: FetchLevel;
  currentRegion: IRegionComposite | null;
  currentRealm: IClientRealm | null;
  items: IQueryItemsItem[];
  selectedItems: IQueryItemsItem[];
  activeSelect: boolean;
}

export interface IDispatchProps {
  onAuctionsQuerySelect: (aqResult: IQueryItemsItem) => void;
  onAuctionsQueryDeselect: (index: number) => void;
  fetchAuctionsQuery: (opts: IGetAuctionsOptions) => void;
  activeSelectChange: (v: boolean) => void;
  refreshAuctionsQuery: (v: IQueryItemsItem[]) => void;
}

type Props = Readonly<IStateProps & IDispatchProps>;

export class QueryAuctionsFilter extends React.Component<Props> {
  private debouncedTriggerQuery = debounce(
    (filterValue: string) => this.triggerQuery(filterValue),
    0.25 * 1000,
  );

  public render() {
    const { queryAuctionsLevel, items, activeSelect, selectedItems } = this.props;

    switch (queryAuctionsLevel) {
      case FetchLevel.success:
      case FetchLevel.refetching:
        return (
          <>
            <Navbar>
              <NavbarGroup align={Alignment.LEFT}>
                <QueryAuctionResultSuggest
                  inputValueRenderer={this.inputValueRenderer}
                  itemRenderer={this.itemRenderer}
                  items={items}
                  onItemSelect={v => this.onItemSelect(v)}
                  closeOnSelect={false}
                  onQueryChange={this.debouncedTriggerQuery}
                  inputProps={{
                    leftIcon: "search",
                    type: "search",
                  }}
                  itemPredicate={this.itemPredicate}
                  itemListRenderer={this.itemListRenderer}
                />
                <div style={{ marginLeft: "10px" }}>{this.renderRefetchingSpinner()}</div>
              </NavbarGroup>
              <NavbarGroup align={Alignment.RIGHT}>
                <Switch
                  checked={activeSelect}
                  label="Active"
                  style={{ marginBottom: "0" }}
                  onChange={() => this.onActiveChange()}
                />
              </NavbarGroup>
            </Navbar>
            {this.renderSelectedItems(selectedItems)}
          </>
        );
      case FetchLevel.failure:
        return <Spinner className={Classes.SMALL} intent={Intent.DANGER} value={1} />;
      case FetchLevel.initial:
        return <Spinner className={Classes.SMALL} intent={Intent.NONE} value={1} />;
      case FetchLevel.fetching:
      default:
        return <Spinner className={Classes.SMALL} intent={Intent.PRIMARY} />;
    }
  }

  private renderRefetchingSpinner() {
    const { queryAuctionsLevel } = this.props;
    if (queryAuctionsLevel !== FetchLevel.refetching) {
      return null;
    }

    return <Spinner className={Classes.SMALL} intent={Intent.PRIMARY} />;
  }

  private onActiveChange() {
    const { activeSelectChange, activeSelect } = this.props;

    activeSelectChange(!activeSelect);
  }

  private itemPredicate: ItemPredicate<IQueryItemsItem> = (
    _query: string,
    result: IQueryItemsItem,
  ) => {
    return result.rank > -1;
  };

  private renderItemAsItemRendererText(item: IItem) {
    const itemText = getItemTextValue(item);
    const itemIconUrl = getItemIconUrl(item);

    if (itemIconUrl === null) {
      return itemText;
    }

    return (
      <>
        <img src={itemIconUrl} className="item-icon" /> {itemText}
      </>
    );
  }

  private renderItemRendererTextContent(result: IQueryItemsItem) {
    const { item } = result;

    if (item !== null) {
      return this.renderItemAsItemRendererText(item);
    }

    return "n/a";
  }

  private renderItemRendererText(result: IQueryItemsItem) {
    return <span className="qaf-menu-item">{this.renderItemRendererTextContent(result)}</span>;
  }

  private itemRenderer: ItemRenderer<IQueryItemsItem> = (
    result: IQueryItemsItem,
    { handleClick, modifiers, index }: IItemRendererProps,
  ) => {
    if (!modifiers.matchesPredicate) {
      return null;
    }

    const { item } = result;
    let className = modifiers.active ? Classes.ACTIVE : "";

    let label = "n/a";
    if (item !== null) {
      label = `#${item.blizzard_meta.id}`;
      className = `${className} ${qualityToColorClass(item.blizzard_meta.quality.type)}`;
    }

    return (
      <MenuItem
        key={index}
        icon={this.isResultSelected(result) ? "tick" : "blank"}
        className={className}
        onClick={handleClick}
        text={this.renderItemRendererText(result)}
        label={label}
      />
    );
  };

  private itemListRenderer: ItemListRenderer<IQueryItemsItem> = (
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
      <Menu ulRef={itemsParentRef} className="qaf-menu">
        <li>
          <H6>Queried Results</H6>
        </li>
        {renderedItems}
      </Menu>
    );
  };

  private onItemSelect(result: IQueryItemsItem) {
    const { onAuctionsQueryDeselect, onAuctionsQuerySelect } = this.props;

    if (this.isResultSelected(result)) {
      onAuctionsQueryDeselect(this.getSelectedResultIndex(result));

      return;
    }

    onAuctionsQuerySelect(result);
  }

  private triggerQuery(filterValue: string) {
    const { fetchAuctionsQuery, currentRealm, currentRegion } = this.props;

    if (currentRegion === null || currentRealm === null) {
      return;
    }

    fetchAuctionsQuery({
      query: filterValue,
      realmSlug: currentRealm.slug,
      regionName: currentRegion.config_region.name,
    });
  }

  private isResultSelected(result: IQueryItemsItem) {
    return this.getSelectedResultIndex(result) > -1;
  }

  private getSelectedResultIndex(result: IQueryItemsItem): number {
    const selectedItems = this.props.selectedItems;
    return getSelectedResultIndex(result, selectedItems);
  }

  private inputValueRenderer(result: IQueryItemsItem): string {
    const { item } = result;

    if (item !== null) {
      return getItemTextValue(item);
    }

    return "n/a";
  }

  private renderSelectedItem(index: number, result: IQueryItemsItem) {
    const { onAuctionsQueryDeselect } = this.props;

    return (
      <Tag
        key={index}
        onRemove={() => onAuctionsQueryDeselect(index)}
        style={{ marginRight: "5px" }}
      >
        {this.inputValueRenderer(result)}
      </Tag>
    );
  }

  private renderSelectedItems(selectedItems: IQueryItemsItem[]) {
    if (selectedItems.length === 0) {
      return;
    }

    return (
      <Callout>
        <H4 className={Classes.HEADING}>Filters</H4>
        <div className={Classes.TAG_INPUT}>
          <div className={Classes.TAG_INPUT_VALUES}>
            {selectedItems.map((v, i) => this.renderSelectedItem(i, v))}
          </div>
        </div>
      </Callout>
    );
  }
}
