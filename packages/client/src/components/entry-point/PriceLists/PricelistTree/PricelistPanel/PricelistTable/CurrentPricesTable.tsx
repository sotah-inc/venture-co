import React from "react";

import { Classes, H4, HTMLTable, Intent, Spinner } from "@blueprintjs/core";
import {
  IPricelistEntryJson,
  IPricelistJson,
  IPriceListMap,
  IRegionComposite,
  IShortItem,
  ItemId,
} from "@sotah-inc/core";

import { ItemPopoverContainer } from "../../../../../../containers/util/ItemPopover";
import { IClientRealm } from "../../../../../../types/global";
import { FetchLevel } from "../../../../../../types/main";
import { qualityToColorClass } from "../../../../../../util";
import { Currency } from "../../../../../util";

export interface IStateProps {
  items: IShortItem[];
  getPricelistLevel: FetchLevel;
  pricelistMap: IPriceListMap;
  fetchRealmLevel: FetchLevel;
}

export interface IOwnProps {
  list: IPricelistJson;
  region: IRegionComposite;
  realm: IClientRealm;
}

type Props = Readonly<IStateProps & IOwnProps>;

export class CurrentPricesTable extends React.Component<Props> {
  public render() {
    return (
      <>
        <H4>Current Prices</H4>
        {this.renderContent()}
      </>
    );
  }

  private getItem(itemId: ItemId): IShortItem | null {
    const { items } = this.props;

    const foundItem = items.find(v => v.id === itemId);
    if (typeof foundItem !== "undefined") {
      return foundItem;
    }

    return null;
  }

  private renderContent() {
    const { fetchRealmLevel } = this.props;

    switch (fetchRealmLevel) {
      case FetchLevel.prompted:
      case FetchLevel.fetching:
      case FetchLevel.refetching:
        return <Spinner intent={Intent.PRIMARY} />;
      case FetchLevel.failure:
        return <Spinner intent={Intent.DANGER} value={1} />;
      case FetchLevel.success:
        return this.renderContentWithRealms();
      case FetchLevel.initial:
      default:
        return <Spinner intent={Intent.NONE} value={0} />;
    }
  }

  private renderContentWithRealms() {
    const { getPricelistLevel } = this.props;

    switch (getPricelistLevel) {
      case FetchLevel.fetching:
        return <Spinner intent={Intent.PRIMARY} />;
      case FetchLevel.failure:
        return <Spinner intent={Intent.DANGER} value={1} />;
      case FetchLevel.success:
        return this.renderTable();
      case FetchLevel.initial:
      default:
        return <Spinner intent={Intent.NONE} value={1} />;
    }
  }

  private renderTable() {
    const { list, items, pricelistMap } = this.props;

    const entries = [...list.pricelist_entries!].sort((a, b) => {
      const aItem = items.find(v => v.id === a.item_id);
      const bItem = items.find(v => v.id === b.item_id);

      let aResult = 0;
      if (a.item_id in pricelistMap) {
        aResult = pricelistMap[a.item_id]!.min_buyout_per * a.quantity_modifier;
      }

      let bResult = 0;
      if (b.item_id in pricelistMap) {
        bResult = pricelistMap[b.item_id]!.min_buyout_per * b.quantity_modifier;
      }

      if (aResult === bResult && aItem && bItem) {
        return aItem.sotah_meta.normalized_name.en_US! > bItem.sotah_meta.normalized_name.en_US!
          ? 1
          : -1;
      }

      return aResult > bResult ? -1 : 1;
    });

    const classes = [
      Classes.HTML_TABLE,
      Classes.HTML_TABLE_BORDERED,
      Classes.SMALL,
      "price-list-table",
    ];

    return (
      <HTMLTable className={classes.join(" ")}>
        <thead>
          <tr>
            <th>Item</th>
            <th>Buyout</th>
            <th>Volume</th>
          </tr>
        </thead>
        <tbody>{entries.map((v, i) => this.renderEntry(i, v))}</tbody>
      </HTMLTable>
    );
  }

  private renderEntry(index: number, entry: IPricelistEntryJson) {
    const { pricelistMap } = this.props;
    const { item_id, quantity_modifier } = entry;

    let buyout: number = 0;
    let volume: number = 0;
    if (item_id in pricelistMap) {
      buyout = pricelistMap[item_id]!.min_buyout_per;
      volume = pricelistMap[item_id]!.volume;
    }

    const item = this.getItem(item_id);
    if (item === null) {
      return (
        <tr key={index}>
          <td colSpan={4}>
            <Spinner intent={Intent.WARNING} />
          </td>
        </tr>
      );
    }

    return (
      <tr key={index}>
        <td className={qualityToColorClass(item.quality.type)}>
          <ItemPopoverContainer
            item={item}
            itemTextFormatter={(itemText: string) => `${itemText} \u00D7${quantity_modifier}`}
          />
        </td>
        <td>
          <Currency amount={buyout * quantity_modifier} />
        </td>
        <td>{volume.toLocaleString()}</td>
      </tr>
    );
  }
}
