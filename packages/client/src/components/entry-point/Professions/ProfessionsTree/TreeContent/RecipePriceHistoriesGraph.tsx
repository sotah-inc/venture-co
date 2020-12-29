import React from "react";

import { Callout, Intent } from "@blueprintjs/core";
import { IShortRecipe, ItemId } from "@sotah-inc/core";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { IFetchData, IItemsData, ILineItemOpen } from "../../../../../types/global";
import { FetchLevel } from "../../../../../types/main";
import { IRecipePriceHistoriesState } from "../../../../../types/professions";
import {
  convertRecipePriceHistoriesToLineData,
  currencyToText,
  getColor,
  getXAxisTimeRestrictions,
  unixTimestampToText,
} from "../../../../../util";
import { TabKind } from "./RecipePriceHistoriesGraph/common";
import { Legend } from "./RecipePriceHistoriesGraph/Legend";

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

const TotalReagentCostDataKey = "total_reagent_cost";

function resolveItemDataKey(id: ItemId): string {
  return `${id}_buyout_per`;
}

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
            {this.renderYAxis()}
            {this.renderLines()}
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

  private renderLine(dataKey: string, index: number) {
    const { highlightedDataKey, totalReagentCostSelected, recipeItemsSelected } = this.state;
    const {
      selectedRecipe,
      recipePriceHistories: {
        data: { recipeItemIds },
      },
    } = this.props;

    if (selectedRecipe === null || typeof selectedRecipe === "undefined") {
      return null;
    }

    const hasSelections = recipeItemsSelected.size > 0 || totalReagentCostSelected;

    const isSelected = ((): boolean => {
      if (dataKey === TotalReagentCostDataKey) {
        return totalReagentCostSelected;
      }

      const recipeItemDataKeys = recipeItemIds[selectedRecipe.data.id].map(resolveItemDataKey);
      if (recipeItemDataKeys.includes(dataKey)) {
        const selectedRecipeItemDataKeys = Array.from(recipeItemsSelected).map(resolveItemDataKey);

        return selectedRecipeItemDataKeys.includes(dataKey);
      }

      return false;
    })();

    const hasHighlightButNotHighlighted =
      highlightedDataKey !== null && dataKey !== highlightedDataKey;

    const { stroke, strokeWidth } = (() => {
      if (highlightedDataKey === null || highlightedDataKey === dataKey) {
        return {
          stroke: getColor(index),
          strokeWidth: highlightedDataKey === dataKey ? 4 : 2,
        };
      }

      return {
        stroke: "#5C7080",
        strokeWidth: 1,
      };
    })();

    const dot = highlightedDataKey === dataKey || isSelected;

    const opacity = (() => {
      if (!hasSelections) {
        return hasHighlightButNotHighlighted ? 0.5 : 1;
      }

      if (!isSelected) {
        if (highlightedDataKey !== null && highlightedDataKey === dataKey) {
          return 1;
        }

        return hasHighlightButNotHighlighted ? 0.5 : 0;
      }

      return hasHighlightButNotHighlighted ? 0.5 : 1;
    })();

    return (
      <Line
        key={index}
        dataKey={(item: ILineItemOpen) => item.data[dataKey] ?? null}
        animationDuration={500}
        animationEasing={"ease-in-out"}
        type={"monotone"}
        stroke={stroke}
        strokeWidth={strokeWidth}
        fill={stroke}
        dot={dot}
        opacity={opacity}
        onMouseEnter={() => {
          this.setState({ ...this.state, highlightedDataKey: dataKey });
        }}
        onMouseLeave={() => {
          this.setState({ ...this.state, highlightedDataKey: null });
        }}
        connectNulls={true}
      />
    );
  }

  private renderLines() {
    const {
      selectedRecipe,
      recipePriceHistories: {
        data: { recipeItemIds },
      },
    } = this.props;

    if (selectedRecipe === null || typeof selectedRecipe === "undefined") {
      return null;
    }

    const dataKeys = [
      TotalReagentCostDataKey,
      ...recipeItemIds[selectedRecipe.data.id].map(resolveItemDataKey),
    ];

    return dataKeys.map((v, i) => this.renderLine(v, i));
  }

  private renderYAxis() {
    const {
      recipePriceHistories: {
        data: { overallPriceLimits },
      },
    } = this.props;

    return (
      <YAxis
        tickFormatter={v => currencyToText(v * 10 * 10)}
        domain={[overallPriceLimits.lower / 10 / 10, overallPriceLimits.upper / 10 / 10]}
        tick={{ fill: "#fff" }}
        scale="log"
        allowDataOverflow={true}
        mirror={true}
      />
    );
  }
}
