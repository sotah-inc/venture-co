import React from "react";

import { Callout, Intent, Tab, Tabs } from "@blueprintjs/core";
import { IShortRecipe, ItemId } from "@sotah-inc/core";

import { CartesianGrid, ResponsiveContainer, XAxis } from "recharts";

import { IFetchData, IItemsData } from "../../../../../types/global";
import { FetchLevel } from "../../../../../types/main";
import { IRecipePriceHistoriesState } from "../../../../../types/professions";
import {
  convertItemPriceHistoriesToLineData,
  convertRecipePriceHistoriesToLineData,
  getXAxisTimeRestrictions,
  unixTimestampToText,
} from "../../../../../util";
import { TabKind } from "./RecipePriceHistoriesGraph/common";
import { ComposedChart } from "./RecipePriceHistoriesGraph/ComposedChart";
import { Legend } from "./RecipePriceHistoriesGraph/Legend";
import { Lines } from "./RecipePriceHistoriesGraph/Lines";
import { YAxis } from "./RecipePriceHistoriesGraph/YAxis";

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

    const { xAxisTicks, roundedNowDate, roundedTwoWeeksAgoDate } = getXAxisTimeRestrictions();

    return (
      <>
        <ResponsiveContainer width="100%" height={250}>
          {ComposedChart({
            children: (
              <>
                <CartesianGrid vertical={false} strokeWidth={0.25} strokeOpacity={0.25} />
                <XAxis
                  dataKey="name"
                  tickFormatter={unixTimestampToText}
                  domain={[roundedTwoWeeksAgoDate.unix(), roundedNowDate.unix()]}
                  type="number"
                  ticks={xAxisTicks}
                  tick={{ fill: "#fff" }}
                />
                {YAxis({
                  craftingCostOptions: {
                    overallPriceLimits: recipePriceHistories.data.recipeData.overallPriceLimits,
                  },
                  currentTabKind,
                  reagentPricesOptions: {
                    aggregatePriceLimits: recipePriceHistories.data.itemData.aggregatePriceLimits,
                  },
                })}
                {Lines({
                  craftingCostOptions: {
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
                    recipeItemIds: selectedRecipe.items.map(v => v.id),
                    recipeItemsSelected,
                    totalReagentCostSelected,
                  },
                  currentTabKind,
                  reagentPricesOptions: {
                    reagentItemIds: Object.keys(recipePriceHistories.data.itemData.history).map(
                      Number,
                    ),
                  },
                })}
              </>
            ),
            craftingCostData: convertRecipePriceHistoriesToLineData(
              recipePriceHistories.data.recipeData.histories,
            ),
            currentTabKind,
            reagentPricesData: convertItemPriceHistoriesToLineData(
              recipePriceHistories.data.itemData.history,
            ),
          })}
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
