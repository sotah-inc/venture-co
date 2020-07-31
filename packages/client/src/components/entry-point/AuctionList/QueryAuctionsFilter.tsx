import React from "react";

import {
  Alignment,
  Callout,
  Classes,
  H4,
  Intent,
  Navbar,
  NavbarGroup,
  Spinner,
  Switch,
  Tag,
} from "@blueprintjs/core";
import { IItem, IRegionComposite } from "@sotah-inc/core";

import { IGetAuctionsOptions } from "../../../api/data";
import { AuctionsOptions } from "../../../types/auction";
import { IClientRealm } from "../../../types/global";
import { FetchLevel } from "../../../types/main";
import { getItemTextValue } from "../../../util";
import { ItemInput } from "../../util";
import { ItemFilter } from "./ItemFilter";

export interface IStateProps {
  queryAuctionsOptions: AuctionsOptions;
  currentRegion: IRegionComposite | null;
  currentRealm: IClientRealm | null;
  activeSelect: boolean;
}

export interface IDispatchProps {
  onAuctionsQuerySelect: (item: IItem) => void;
  onAuctionsQueryDeselect: (index: number) => void;
  fetchAuctions: (opts: IGetAuctionsOptions) => void;
  fetchQueryAuctions: (query: string) => void;
  activeSelectChange: (v: boolean) => void;
}

type Props = Readonly<IStateProps & IDispatchProps>;

export class QueryAuctionsFilter extends React.Component<Props> {
  public render() {
    const {
      currentRealm,
      currentRegion,
      activeSelect,
      queryAuctionsOptions: {
        queryAuctions: {
          results: { level: queryAuctionsLevel },
          selected: selectedItems,
        },
      },
      fetchQueryAuctions,
    } = this.props;

    switch (queryAuctionsLevel) {
      case FetchLevel.success:
      case FetchLevel.refetching:
        return (
          <>
            <Navbar>
              <NavbarGroup align={Alignment.LEFT}>
                <ItemInput onSelect={v => this.onItemSelect(v)} />
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

  private refreshFilter(query: string) {
    const {} = this.props;
  }

  private renderRefetchingSpinner() {
    const {} = this.props;
    if (queryAuctionsLevel !== FetchLevel.refetching) {
      return null;
    }

    return <Spinner className={Classes.SMALL} intent={Intent.PRIMARY} />;
  }

  private onActiveChange() {
    const { activeSelectChange, activeSelect } = this.props;

    activeSelectChange(!activeSelect);
  }

  private onItemSelect(item: IItem) {
    const { onAuctionsQueryDeselect, onAuctionsQuerySelect } = this.props;

    if (item === null) {
      return;
    }

    if (this.isResultSelected(item)) {
      onAuctionsQueryDeselect(this.getSelectedResultIndex(item));

      return;
    }

    onAuctionsQuerySelect(item);
  }

  private isResultSelected(item: IItem) {
    return this.getSelectedResultIndex(item) > -1;
  }

  private getSelectedResultIndex(item: IItem): number {
    const {
      queryAuctionsOptions: { selected },
    } = this.props;

    return selected.map(v => v.blizzard_meta.id).indexOf(item.blizzard_meta.id);
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
