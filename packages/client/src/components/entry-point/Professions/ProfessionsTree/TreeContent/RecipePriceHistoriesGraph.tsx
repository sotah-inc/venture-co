import { RecipeId } from "@sotah-inc/core";
import React from "react";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { IFetchData, ILineItemOpen } from "../../../../../types/global";
import { FetchLevel } from "../../../../../types/main";
import { IRecipePriceHistoriesState } from "../../../../../types/professions";
import {
  convertRecipePriceHistoriesToLineData,
  currencyToText,
  getColor,
  getXAxisTimeRestrictions,
  unixTimestampToText,
} from "../../../../../util";

// props
export interface IStateProps {
  selectedRecipeId: RecipeId;
  recipePriceHistories: IFetchData<IRecipePriceHistoriesState>;
}

export type Props = Readonly<IStateProps>;

type State = Readonly<{
  highlightedDataKey: string | null;
}>;

export class RecipePriceHistoriesGraph extends React.Component<Props, State> {
  public state: State = {
    highlightedDataKey: null,
  };

  public render() {
    const { recipePriceHistories } = this.props;

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
      </>
    );
  }

  private renderRecipeItemLine(dataKey: string, index: number) {
    const { highlightedDataKey } = this.state;

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

    const dot = highlightedDataKey === dataKey;

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
        onMouseEnter={() => {
          this.setState({ ...this.state, highlightedDataKey: dataKey });
        }}
        onMouseLeave={() => {
          this.setState({ ...this.state, highlightedDataKey: null });
        }}
      />
    );
  }

  private renderLines() {
    const {
      selectedRecipeId,
      recipePriceHistories: {
        data: { recipeItemIds },
      },
    } = this.props;

    const dataKeys = [
      ...recipeItemIds[selectedRecipeId].map(v => `${v}_buyout_per`),
      "total_reagent_cost",
    ];

    return dataKeys.map((v, i) => this.renderRecipeItemLine(v, i));
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
