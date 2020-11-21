import React from "react";

import { IPriceListMap, IShortRecipe, ItemId, resolveCraftedItemIds } from "@sotah-inc/core";

import { IFetchData, IItemsData } from "../../../../types/global";
import { ISelectedSkillTierCategory } from "../../../../types/professions";
import { Currency } from "../../../util";
import { IEntryRow, PricesTable } from "../../../util/PricesTable";

// props
export interface IStateProps {
  selectedRecipe: IItemsData<IShortRecipe> | null;
  selectedSkillTierCategory: ISelectedSkillTierCategory;
  priceTable: IFetchData<IItemsData<IPriceListMap>>;
}

export type Props = Readonly<IStateProps>;

export class TreeContent extends React.Component<Props> {
  public render() {
    const { selectedSkillTierCategory, selectedRecipe, priceTable } = this.props;

    if (selectedRecipe === null) {
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
        <p>Hello, world!</p>
        <p>{selectedSkillTierCategory.index}</p>
        <p>{selectedSkillTierCategory.isSelected ? "isSelected" : "not isSelected"}</p>
        <p>recipe: {selectedRecipe?.data.id ?? "none"}</p>
        <PricesTable
          priceTable={priceTable}
          entryRows={entryRows}
          title="Reagent Prices"
          footerContent={this.renderFooter()}
        />
      </>
    );
  }

  private getRecipeReagentTotalCost(): number {
    const { selectedRecipe, priceTable } = this.props;

    if (selectedRecipe === null) {
      return 0;
    }

    return selectedRecipe.data.reagents.reduce((foundTotal, v): number => {
      const foundPrice = priceTable.data.data[v.reagent.id];
      if (!foundPrice) {
        return foundTotal;
      }

      return foundTotal + foundPrice.min_buyout_per * v.quantity;
    }, 0);
  }

  private renderFooter() {
    const { selectedRecipe } = this.props;

    if (selectedRecipe === null) {
      return null;
    }

    const craftedItemIds = resolveCraftedItemIds(selectedRecipe.data);

    return (
      <>
        <tr>
          <th style={{ textAlign: "right" }}>Total</th>
          <td colSpan={2}>
            <Currency amount={this.getRecipeReagentTotalCost()} />
          </td>
        </tr>
        {craftedItemIds.map(v => this.renderItemProfit(v))}
      </>
    );
  }

  private renderItemProfit(id: ItemId) {
    const { priceTable } = this.props;

    const itemCost: number | null = priceTable.data.data[id]?.min_buyout_per ?? null;
    if (itemCost === null) {
      return (
        <tr>
          <th style={{ textAlign: "right" }}>Profit for {id}</th>
          <td colSpan={2}>
            <em>No data found for this item.</em>
          </td>
        </tr>
      );
    }

    return (
      <tr>
        <th style={{ textAlign: "right" }}>Profit for {id}</th>
        <td colSpan={2}>
          <Currency amount={itemCost - this.getRecipeReagentTotalCost()} />
        </td>
      </tr>
    );
  }
}
