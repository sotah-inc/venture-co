import React from "react";

import { Callout, Intent, Tab, Tabs } from "@blueprintjs/core";
import { IShortRecipe, ItemId } from "@sotah-inc/core";
import { ResponsiveContainer } from "recharts";

import { IFetchData, IItemsData } from "../../../../../types/global";
import { FetchLevel } from "../../../../../types/main";
import { IRecipePriceHistoriesState } from "../../../../../types/professions";
import {
  convertItemPriceHistoriesToLineData,
  convertRecipePriceHistoriesToLineData,
} from "../../../../../util";
import { TabKind } from "./RecipePriceHistoriesGraph/common";
import { CraftingCostChart } from "./RecipePriceHistoriesGraph/CraftingCostChart";
import { Legend } from "./RecipePriceHistoriesGraph/Legend";
import { ReagentPricesChart } from "./RecipePriceHistoriesGraph/ReagentPricesChart";

// props
export interface IStateProps {
  selectedRecipe: IItemsData<IShortRecipe> | null | undefined;
  recipePriceHistories: IFetchData<IRecipePriceHistoriesState>;
}

export type Props = Readonly<IStateProps>;

type State = Readonly<{
  currentTabKind: TabKind;

  craftingCostState: {
    highlightedDataKey: string | null;
    recipeItemsSelected: Set<number>;
    totalReagentCostSelected: boolean;
  };
}>;

export class RecipePriceHistoriesGraph extends React.Component<Props, State> {
  public state: State = {
    currentTabKind: TabKind.craftingCost,

    craftingCostState: {
      highlightedDataKey: null,
      recipeItemsSelected: new Set<ItemId>(),
      totalReagentCostSelected: false,
    },
  };

  public render() {
    const { currentTabKind } = this.state;

    return (
      <>
        <div style={{ marginBottom: "10px" }}>
          <Tabs
            id="recipe-price-histories-tabs"
            selectedTabId={currentTabKind}
            onChange={(tabKind: TabKind) => this.setState({ currentTabKind: tabKind })}
          >
            <Tab id={TabKind.craftingCost} title="Crafting Cost" />
            <Tab id={TabKind.reagentPrices} title="Reagent Prices" />
          </Tabs>
        </div>
        <div style={{ marginBottom: "10px" }}>{this.renderContent()}</div>
      </>
    );
  }

  private renderContent() {
    const { recipePriceHistories, selectedRecipe } = this.props;
    const {
      currentTabKind,
      craftingCostState: { highlightedDataKey, recipeItemsSelected, totalReagentCostSelected },
    } = this.state;

    if (selectedRecipe === null || typeof selectedRecipe === "undefined") {
      return null;
    }

    if (recipePriceHistories.level !== FetchLevel.success) {
      return <p>fail!</p>;
    }

    return (
      <>
        <ResponsiveContainer width="100%" height={250}>
          {this.renderChart()}
        </ResponsiveContainer>
        <Legend
          currentTabKind={currentTabKind}
          craftingCostOptions={{
            craftedRecipeItemIds:
              recipePriceHistories.data.recipeData.recipeItemIds[selectedRecipe.data.id],
            highlightedDataKey,
            onDataKeyHighlight: v =>
              this.setState({
                ...this.state,
                craftingCostState: { ...this.state.craftingCostState, highlightedDataKey: v },
              }),
            onRecipeItemSelect: v => {
              recipeItemsSelected.add(v);
              this.setState({
                ...this.state,
                craftingCostState: { ...this.state.craftingCostState, recipeItemsSelected },
              });
            },
            onReset: () => {
              this.setState({
                ...this.state,
                craftingCostState: {
                  ...this.state.craftingCostState,
                  recipeItemsSelected: new Set<ItemId>(),
                  totalReagentCostSelected: false,
                },
              });
            },
            onTotalReagentCostSelect: () => {
              this.setState({
                ...this.state,
                craftingCostState: {
                  ...this.state.craftingCostState,
                  totalReagentCostSelected: true,
                },
              });
            },
            recipeItems: selectedRecipe.items,
            recipeItemsSelected,
            totalReagentCostSelected,
          }}
        />
        {this.renderGraphFooter()}
      </>
    );
  }

  private renderChart() {
    const {
      recipePriceHistories: {
        data: {
          recipeData: { overallPriceLimits, histories: recipePriceHistories },
          itemData: { aggregatePriceLimits, history: recipeItemPriceHistories },
        },
      },
      selectedRecipe,
    } = this.props;
    const {
      currentTabKind,
      craftingCostState: { highlightedDataKey, recipeItemsSelected, totalReagentCostSelected },
    } = this.state;

    if (selectedRecipe === null || typeof selectedRecipe === "undefined") {
      return null;
    }

    switch (currentTabKind) {
      case TabKind.craftingCost:
        return CraftingCostChart({
          data: convertRecipePriceHistoriesToLineData(recipePriceHistories),
          highlightedDataKey,
          onDataKeyHighlight: v => {
            this.setState({
              ...this.state,
              craftingCostState: {
                ...this.state.craftingCostState,
                highlightedDataKey: v,
              },
            });
          },
          overallPriceLimits,
          recipeItemIds: selectedRecipe.items.map(v => v.id),
          recipeItemsSelected,
          totalReagentCostSelected,
        });
      case TabKind.reagentPrices:
        return ReagentPricesChart({
          aggregatePriceLimits,
          data: convertItemPriceHistoriesToLineData(recipeItemPriceHistories),
          reagentItemIds: Object.keys(recipeItemPriceHistories).map(Number),
        });
      default:
        return null;
    }
  }

  private renderGraphFooter() {
    const { currentTabKind } = this.state;

    switch (currentTabKind) {
      case TabKind.craftingCost:
        return (
          <Callout intent={Intent.PRIMARY} style={{ marginBottom: "10px" }}>
            Crating cost price graph is of average prices.
          </Callout>
        );
      case TabKind.reagentPrices:
      default:
        return null;
    }
  }
}
