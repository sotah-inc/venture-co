import { RecipeId } from "@sotah-inc/core";
import React from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { IFetchData, ILineItemOpen } from "../../../../../types/global";
import { FetchLevel } from "../../../../../types/main";
import { IRecipePriceHistoriesState } from "../../../../../types/professions";
import {
  convertRecipePriceHistoriesToLineData,
  currencyToText,
  getXAxisTimeRestrictions,
  unixTimestampToText,
} from "../../../../../util";

// props
export interface IStateProps {
  recipePriceHistories: IFetchData<IRecipePriceHistoriesState>;
}

export type Props = Readonly<IStateProps>;

export class RecipePriceHistoriesGraph extends React.Component<Props> {
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

  private renderLine(index: number, _recipeId: RecipeId) {
    return (
      <Line
        key={index}
        dataKey={(item: ILineItemOpen) => {
          // tslint:disable-next-line:no-console
          console.log(item.data["total_reagent_prices_average_buyout_per"]);

          return item.data["total_reagent_prices_average_buyout_per"];
        }}
        type={"monotone"}
      />
    );
  }

  private renderLines() {
    const { recipePriceHistories } = this.props;

    return Object.keys(recipePriceHistories.data.histories).map((recipeId, index) => {
      return this.renderLine(index, Number(recipeId));
    });
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
