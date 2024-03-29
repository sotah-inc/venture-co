import React from "react";

import {
  IItemPrices,
  IItemsVendorPricesResponse,
  IShortRecipe,
  ItemId,
  resolveCraftedItemIds,
} from "@sotah-inc/core";

import { IFetchData, IItemsData } from "../../../../../types/global";
import { Currency, ItemPopover } from "../../../../util";
import { IEntryRow, PricesTable } from "../../../../util/PricesTable";

// props
export interface IStateProps {
  selectedRecipe: IItemsData<IShortRecipe> | null | undefined;
  priceTable: IFetchData<IItemsData<IItemPrices>>;
  itemsVendorPrices: IFetchData<IItemsVendorPricesResponse>;
}

export type Props = Readonly<IStateProps>;

export class ReagentPricesTable extends React.Component<Props> {
  public render(): React.ReactNode {
    const { selectedRecipe, priceTable, itemsVendorPrices } = this.props;

    if (typeof selectedRecipe === "undefined" || selectedRecipe === null) {
      return null;
    }

    const entryRows = selectedRecipe.data.reagents.map<IEntryRow>(v => {
      return {
        item_id: v.reagent.id,
        quantity_modifier: v.quantity,
      };
    });

    return (
      <>
        <PricesTable
          priceTable={priceTable}
          entryRows={entryRows}
          title="Reagent Prices"
          footerContent={this.renderFooter()}
          itemVendorPrices={itemsVendorPrices.data}
        />
      </>
    );
  }

  private getRecipeReagentTotalCost(): number {
    const { selectedRecipe, priceTable, itemsVendorPrices } = this.props;

    if (typeof selectedRecipe === "undefined" || selectedRecipe === null) {
      return 0;
    }

    return selectedRecipe.data.reagents.reduce((foundTotal, v): number => {
      const foundVendorPrice = itemsVendorPrices.data.vendor_prices[v.reagent.id];
      if (foundVendorPrice) {
        return foundTotal + foundVendorPrice * v.quantity;
      }

      const foundPrice = priceTable.data.data[v.reagent.id];
      if (!foundPrice) {
        return foundTotal;
      }

      return foundTotal + foundPrice.market_price_buyout_per * v.quantity;
    }, 0);
  }

  private renderFooter() {
    const { selectedRecipe } = this.props;

    if (typeof selectedRecipe === "undefined" || selectedRecipe === null) {
      return null;
    }

    const craftedItemIds = resolveCraftedItemIds(selectedRecipe.data);

    const foundTotalCost = (() => {
      const reagentTotalCost = this.getRecipeReagentTotalCost();
      if (reagentTotalCost === 0) {
        return <em>No data found.</em>;
      }

      return <Currency amount={reagentTotalCost} />;
    })();

    return (
      <>
        <tr>
          <th style={{ textAlign: "right" }}>Total Reagent Cost</th>
          <td colSpan={2}>{foundTotalCost}</td>
        </tr>
        {craftedItemIds.map((v, i) => this.renderItemProfit(v, i))}
      </>
    );
  }

  private renderItemProfit(id: ItemId, itemProfitIndex: number) {
    const { priceTable } = this.props;

    const item = (() => {
      const foundItem = priceTable.data.items.find(v => v.id === id);
      if (!foundItem) {
        return `Item #${id}`;
      }

      return <ItemPopover item={foundItem} interactive={false} placement={"left"} />;
    })();

    const itemCost: number | null = priceTable.data.data[id]?.market_price_buyout_per ?? null;
    if (itemCost === null) {
      return (
        <tr key={itemProfitIndex}>
          <th style={{ textAlign: "right" }}>Current price of {item}</th>
          <td colSpan={2}>
            <em>No data found for this item.</em>
          </td>
        </tr>
      );
    }

    const expectedProfit = (() => {
      const reagentTotalCost = this.getRecipeReagentTotalCost();
      if (reagentTotalCost === 0) {
        return <em>Not enough data for comparison.</em>;
      }

      return <Currency amount={itemCost - reagentTotalCost} />;
    })();

    return (
      <React.Fragment key={itemProfitIndex}>
        <tr>
          <th style={{ textAlign: "right" }}>Current price of {item}</th>
          <td colSpan={2}>
            <Currency amount={itemCost} />
          </td>
        </tr>
        <tr>
          <th style={{ textAlign: "right" }}>Expected profit for for {item}</th>
          <td colSpan={2}>{expectedProfit}</td>
        </tr>
      </React.Fragment>
    );
  }
}
