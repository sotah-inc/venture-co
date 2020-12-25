import React from "react";

import { IRecipePriceHistories } from "@sotah-inc/core";
import { CartesianGrid, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { IFetchData } from "../../../../../types/global";
import { currencyToText, getXAxisTimeRestrictions, unixTimestampToText } from "../../../../../util";

// props
export interface IStateProps {
  recipePriceHistories: IFetchData<IRecipePriceHistories>;
}

export type Props = Readonly<IStateProps>;

export class RecipePriceHistoriesGraph extends React.Component<Props> {
  public render() {
    const data = {};

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

  private renderYAxis() {
    return (
      <YAxis
        tickFormatter={v => currencyToText(v * 10 * 10)}
        domain={[resolvedLimits.lower / 10 / 10, resolvedLimits.upper / 10 / 10]}
        tick={{ fill: "#fff" }}
        scale="log"
        allowDataOverflow={true}
        mirror={true}
      />
    );
  }
}
