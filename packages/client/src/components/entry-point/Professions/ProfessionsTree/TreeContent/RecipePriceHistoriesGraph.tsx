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
  mergeLineData,
} from "../../../../../util";
import { TabKind } from "./RecipePriceHistoriesGraph/common";
import { CraftingCostChart } from "./RecipePriceHistoriesGraph/CraftingCostChart";
import { CraftingCostLegend } from "./RecipePriceHistoriesGraph/CraftingCostLegend";
import { ReagentPricesChart } from "./RecipePriceHistoriesGraph/ReagentPricesChart";
import { ReagentPricesLegend } from "./RecipePriceHistoriesGraph/ReagentPricesLegend";

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

  reagentPricesState: {
    highlightedDataKey: string | null;
  };
}>;

export class RecipePriceHistoriesGraph extends React.Component<Props, State> {
  public state: State = {
    currentTabKind: TabKind.reagentPrices,

    craftingCostState: {
      highlightedDataKey: null,
      recipeItemsSelected: new Set<ItemId>(),
      totalReagentCostSelected: false,
    },

    reagentPricesState: {
      highlightedDataKey: null,
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
            <Tab id={TabKind.reagentPrices} title="Reagent Prices" />
            <Tab id={TabKind.craftingCost} title="Crafting Cost" />
          </Tabs>
        </div>
        <div style={{ marginBottom: "10px" }}>{this.renderContent()}</div>
      </>
    );
  }

  private renderContent() {
    const { recipePriceHistories, selectedRecipe } = this.props;

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
        {this.renderLegend()}
        {this.renderGraphFooter()}
      </>
    );
  }

  private renderLegend() {
    const { recipePriceHistories, selectedRecipe } = this.props;
    const {
      currentTabKind,
      craftingCostState: { highlightedDataKey, recipeItemsSelected, totalReagentCostSelected },
    } = this.state;

    if (selectedRecipe === null || typeof selectedRecipe === "undefined") {
      return null;
    }

    switch (currentTabKind) {
      case TabKind.craftingCost:
        return (
          <CraftingCostLegend
            craftedRecipeItemIds={
              recipePriceHistories.data.recipeData.recipeItemIds[selectedRecipe.data.id]
            }
            highlightedDataKey={highlightedDataKey}
            onDataKeyHighlight={v =>
              this.setState({
                ...this.state,
                craftingCostState: { ...this.state.craftingCostState, highlightedDataKey: v },
              })
            }
            onRecipeItemSelect={v => {
              recipeItemsSelected.add(v);
              this.setState({
                ...this.state,
                craftingCostState: { ...this.state.craftingCostState, recipeItemsSelected },
              });
            }}
            onReset={() => {
              this.setState({
                ...this.state,
                craftingCostState: {
                  ...this.state.craftingCostState,
                  recipeItemsSelected: new Set<ItemId>(),
                  totalReagentCostSelected: false,
                },
              });
            }}
            onTotalReagentCostSelect={() => {
              this.setState({
                ...this.state,
                craftingCostState: {
                  ...this.state.craftingCostState,
                  totalReagentCostSelected: true,
                },
              });
            }}
            recipeItems={selectedRecipe.items}
            recipeItemsSelected={recipeItemsSelected}
            totalReagentCostSelected={totalReagentCostSelected}
          />
        );
      case TabKind.reagentPrices:
        return (
          <ReagentPricesLegend
            highlightedDataKey={highlightedDataKey}
            onDataKeyHighlight={v =>
              this.setState({
                ...this.state,
                craftingCostState: { ...this.state.craftingCostState, highlightedDataKey: v },
              })
            }
            itemIds={[
              ...Object.keys(recipePriceHistories.data.itemData.history).map(Number),
              ...recipePriceHistories.data.recipeData.recipeItemIds[selectedRecipe.data.id],
            ]}
            items={selectedRecipe.items}
          />
        );
      default:
        return null;
    }
  }

  private renderChart() {
    const {
      recipePriceHistories: {
        data: {
          recipeData: { overallPriceLimits, histories: recipePriceHistories, recipeItemIds },
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

    const craftingCostData = convertRecipePriceHistoriesToLineData(recipePriceHistories);
    const reagentPricesData = convertItemPriceHistoriesToLineData(recipeItemPriceHistories);

    switch (currentTabKind) {
      case TabKind.craftingCost:
        return CraftingCostChart({
          data: craftingCostData,
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
          data: mergeLineData(craftingCostData, reagentPricesData),
          reagentItemIds: Object.keys(recipeItemPriceHistories).map(Number),
          recipeItemIds: recipeItemIds[selectedRecipe.data.id],
          selectedRecipe,
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
