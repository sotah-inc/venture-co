import {
  Alignment,
  Callout,
  Classes,
  H4,
  Navbar,
  NavbarGroup,
  Switch,
  Tag,
} from "@blueprintjs/core";
import { IAuction, IItem } from "@sotah-inc/core";
import React from "react";

import { IGetAuctionsOptions } from "../../../api/data";
import { AuctionsOptions } from "../../../types/auction";
import { IFetchData, IItemsData } from "../../../types/global";
import { getItemTextValue } from "../../../util";
import { ItemInput } from "../../util";

export interface IStateProps {
  queryAuctionsOptions: AuctionsOptions;
  activeSelect: boolean;
  auctionsResult: IFetchData<IItemsData<IAuction[]>>;
}

export interface IDispatchProps {
  onAuctionsQuerySelect: (item: IItem) => void;
  onAuctionsQueryDeselect: (index: number) => void;
  fetchAuctions: (opts: IGetAuctionsOptions) => void;
  activeSelectChange: (v: boolean) => void;
}

type Props = Readonly<IStateProps & IDispatchProps>;

export class QueryAuctionsFilter extends React.Component<Props> {
  public render() {
    const {
      activeSelect,
      queryAuctionsOptions: { selected: selectedItems },
      activeSelectChange,
    } = this.props;

    return (
      <>
        <Navbar>
          <NavbarGroup align={Alignment.LEFT}>
            <ItemInput onSelect={v => this.onItemSelect(v)} />
          </NavbarGroup>
          <NavbarGroup align={Alignment.RIGHT}>
            <Switch
              checked={activeSelect}
              label="Active"
              style={{ marginBottom: "0" }}
              onChange={() => activeSelectChange(activeSelect)}
            />
          </NavbarGroup>
        </Navbar>
        {this.renderSelectedItems(selectedItems)}
      </>
    );
  }

  private onItemSelect(item: IItem) {
    const {
      onAuctionsQueryDeselect,
      onAuctionsQuerySelect,
      queryAuctionsOptions: { selected },
    } = this.props;

    if (item === null) {
      return;
    }

    const itemIdIndex = selected.map(v => v.blizzard_meta.id).indexOf(item.blizzard_meta.id);
    if (itemIdIndex === -1) {
      onAuctionsQuerySelect(item);

      return;
    }

    onAuctionsQueryDeselect(itemIdIndex);
  }

  private renderSelectedItem(index: number, item: IItem) {
    const { onAuctionsQueryDeselect } = this.props;

    return (
      <Tag
        key={index}
        onRemove={() => onAuctionsQueryDeselect(index)}
        style={{ marginRight: "5px" }}
      >
        {getItemTextValue(item)}
      </Tag>
    );
  }

  private renderSelectedItems(selectedItems: IItem[]) {
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
