import React from "react";

import { H2, Position } from "@blueprintjs/core";
import { IItemPrices, IShortRecipe, ItemId, resolveCraftedItemIds } from "@sotah-inc/core";

import { RecipePriceHistoriesGraphContainer } from "../../../../containers/entry-point/Professions/ProfessionsTree/TreeContent/RecipePriceHistoriesGraph";
import { IFetchData, IItemsData } from "../../../../types/global";
import { ISelectedSkillTierCategory } from "../../../../types/professions";
import { Currency, ItemPopover } from "../../../util";
import { IEntryRow, PricesTable } from "../../../util/PricesTable";

// props
export interface IStateProps {
  selectedRecipe: IItemsData<IShortRecipe> | null | undefined;
  selectedSkillTierCategory: ISelectedSkillTierCategory;
  priceTable: IFetchData<IItemsData<IItemPrices>>;
}

export type Props = Readonly<IStateProps>;

export class TreeContent extends React.Component<Props> {
  public render() {
    const { selectedRecipe, priceTable } = this.props;

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
        {this.renderTitle()}
        <RecipePriceHistoriesGraphContainer />
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

    if (typeof selectedRecipe === "undefined" || selectedRecipe === null) {
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
          <th style={{ textAlign: "right" }}>Total</th>
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

      return <ItemPopover item={foundItem} interactive={false} position={Position.LEFT} />;
    })();

    const itemCost: number | null = priceTable.data.data[id]?.min_buyout_per ?? null;
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

  private renderTitle() {
    const { selectedRecipe } = this.props;

    if (selectedRecipe === null || typeof selectedRecipe === "undefined") {
      return null;
    }

    if (selectedRecipe.data.icon_url.length === 0) {
      return <H2>{selectedRecipe.data.name}</H2>;
    }

    return (
      <H2 className="recipe-price-histories-table-heading">
        <img src={selectedRecipe.data.icon_url} className="profession-icon" alt="" />{" "}
        {selectedRecipe.data.name}
      </H2>
    );
  }
}
