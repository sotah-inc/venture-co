import React from "react";

import { Classes, H4, HTMLTable, Intent, Spinner } from "@blueprintjs/core";
import { IItemPrices, IShortItem, ItemId } from "@sotah-inc/core";

import { ItemPopoverContainer } from "../../containers/util/ItemPopover";
import { IFetchData, IItemsData } from "../../types/global";
import { FetchLevel } from "../../types/main";
import { qualityToColorClass } from "../../util";
import { Currency } from "./Currency";

export interface IEntryRow {
  item_id: ItemId;
  quantity_modifier: number;
}

export interface IOwnProps {
  entryRows: IEntryRow[];
  priceTable: IFetchData<IItemsData<IItemPrices>>;
  title: string;
  footerContent?: React.ReactNode;
}

type Props = Readonly<IOwnProps>;

export class PricesTable extends React.Component<Props> {
  public static defaultProps: Partial<Props> = {
    title: "Current Prices",
  };

  public render(): React.ReactNode {
    const { title } = this.props;

    return (
      <>
        <H4>{title}</H4>
        {this.renderContent()}
      </>
    );
  }

  private getItem(itemId: ItemId): IShortItem | null {
    const {
      priceTable: {
        data: { items },
      },
    } = this.props;

    const foundItem = items.find(v => v.id === itemId);
    if (typeof foundItem !== "undefined") {
      return foundItem;
    }

    return null;
  }

  private renderContent() {
    const {
      priceTable: { level: getPricelistLevel },
    } = this.props;

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
    const {
      entryRows,
      priceTable: {
        data: { items, data: pricelistMap },
      },
      footerContent,
    } = this.props;

    const entries = entryRows.sort((a, b) => {
      const aItem = items.find(v => v.id === a.item_id);
      const aEntry = pricelistMap[a.item_id];
      const aResult = aEntry ? aEntry.min_buyout_per * a.quantity_modifier : 0;

      const bItem = items.find(v => v.id === b.item_id);
      const bEntry = pricelistMap[b.item_id];
      const bResult = bEntry ? bEntry.min_buyout_per * a.quantity_modifier : 0;

      if (
        aResult === bResult &&
        aItem &&
        bItem &&
        aItem.sotah_meta.normalized_name.en_US &&
        bItem.sotah_meta.normalized_name.en_US
      ) {
        return aItem.sotah_meta.normalized_name.en_US > bItem.sotah_meta.normalized_name.en_US
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
        {footerContent && <tfoot>{footerContent}</tfoot>}
      </HTMLTable>
    );
  }

  private getItemInfo(itemId: ItemId) {
    const {
      priceTable: {
        data: { data: pricelistMap },
      },
    } = this.props;

    const foundEntry = pricelistMap[itemId];

    return {
      buyout: foundEntry ? foundEntry.min_buyout_per : 0,
      volume: foundEntry ? foundEntry.volume : 0,
    };
  }

  private renderEntry(index: number, entry: IEntryRow) {
    const { item_id, quantity_modifier } = entry;

    const { buyout, volume } = this.getItemInfo(item_id);

    const item = this.getItem(item_id);
    if (item === null) {
      return (
        <tr key={index}>
          <td colSpan={3}>
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
            interactive={false}
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
