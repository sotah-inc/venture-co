import React from "react";

import { Callout, Intent } from "@blueprintjs/core";
import { IShortRecipe, ItemId } from "@sotah-inc/core";

import { CartesianGrid, LineChart, ResponsiveContainer, XAxis } from "recharts";

import { IFetchData, IItemsData } from "../../../../../types/global";
import { FetchLevel } from "../../../../../types/main";
import { IRecipePriceHistoriesState } from "../../../../../types/professions";
import {
  convertRecipePriceHistoriesToLineData,
  getXAxisTimeRestrictions,
  unixTimestampToText,
} from "../../../../../util";
import { TabKind } from "./RecipePriceHistoriesGraph/common";
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
  highlightedDataKey: string | null;
  recipeItemsSelected: Set<number>;
  totalReagentCostSelected: boolean;
  currentTabKind: TabKind;
}>;

export class RecipePriceHistoriesGraph extends React.Component<Props, State> {
  public state: State = {
    currentTabKind: TabKind.craftingCost,
    highlightedDataKey: null,
    recipeItemsSelected: new Set<ItemId>(),
    totalReagentCostSelected: false,
  };

  public render() {
    const { recipePriceHistories, selectedRecipe } = this.props;
    const {
      currentTabKind,
      highlightedDataKey,
      recipeItemsSelected,
      totalReagentCostSelected,
    } = this.state;

    if (selectedRecipe === null || typeof selectedRecipe === "undefined") {
      return null;
    }

    if (recipePriceHistories.level !== FetchLevel.success) {
      return <p>fail!</p>;
    }

    const data = convertRecipePriceHistoriesToLineData(recipePriceHistories.data.histories);

    const { xAxisTicks, roundedNowDate, roundedTwoWeeksAgoDate } = getXAxisTimeRestrictions();

    return (
      <>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
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
              currentTabKind,
              overallPriceLimits: recipePriceHistories.data.overallPriceLimits,
            })}
            {Lines({
              craftingCostOptions: {
                highlightedDataKey,
                onDataKeyHighlight: v => {
                  this.setState({ ...this.state, highlightedDataKey: v });
                },
                recipeItemIds: selectedRecipe.items.map(v => v.id),
                recipeItemsSelected,
                totalReagentCostSelected,
              },
              currentTabKind,
            })}
          </LineChart>
        </ResponsiveContainer>
        <Legend
          currentTabKind={currentTabKind}
          craftingCostOptions={{
            highlightedDataKey,
            onDataKeyHighlight: v => this.setState({ ...this.state, highlightedDataKey: v }),
            onRecipeItemSelect: v => {
              recipeItemsSelected.add(v);
              this.setState({ ...this.state, recipeItemsSelected });
            },
            onReset: () => {
              this.setState({
                ...this.state,
                recipeItemsSelected: new Set<ItemId>(),
                totalReagentCostSelected: false,
              });
            },
            onTotalReagentCostSelect: () => {
              this.setState({
                ...this.state,
                totalReagentCostSelected: true,
              });
            },
            recipeItems: selectedRecipe.items,
            recipeItemsSelected,
            totalReagentCostSelected,
          }}
        />

        <Callout intent={Intent.PRIMARY} style={{ marginBottom: "10px" }}>
          Price graph is of average prices.
        </Callout>
      </>
    );
  }
}
