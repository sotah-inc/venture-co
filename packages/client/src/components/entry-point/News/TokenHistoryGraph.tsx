import React from "react";

import { RegionName } from "@sotah-inc/core";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { IFetchData, ILineItemOpen } from "../../../types/global";
import { FetchLevel } from "../../../types/main";
import { IRegionTokenHistories } from "../../../types/posts";
import {
  convertRegionTokenHistoriesToLineData,
  currencyToText,
  getXAxisTimeRestrictions,
  unixTimestampToText,
  zeroGraphValue,
} from "../../../util";

export interface IStateProps {
  regionTokenHistories: IFetchData<IRegionTokenHistories>;
}

type Props = Readonly<IStateProps>;

export class TokenHistoryGraph extends React.Component<Props> {
  private static renderXAxis() {
    const { xAxisTicks, roundedNowDate, roundedTwoWeeksAgoDate } = getXAxisTimeRestrictions();

    return (
      <XAxis
        dataKey="name"
        tickFormatter={unixTimestampToText}
        domain={[roundedTwoWeeksAgoDate.unix(), roundedNowDate.unix()]}
        type="number"
        ticks={xAxisTicks}
        tick={{ fill: "#fff" }}
      />
    );
  }

  private static renderYAxis() {
    return (
      <YAxis
        tickFormatter={v => currencyToText(v * 10 * 10)}
        domain={[
          dataMin => {
            if (dataMin <= 1) {
              return zeroGraphValue;
            }

            const result = Math.pow(10, Math.floor(Math.log10(dataMin)));
            if (result === 0) {
              return zeroGraphValue;
            }

            return result;
          },
          dataMax => {
            if (dataMax <= 1) {
              return 10;
            }

            return Math.pow(10, Math.ceil(Math.log10(dataMax)));
          },
        ]}
        tick={{ fill: "#fff" }}
        scale="log"
        allowDataOverflow={true}
        mirror={true}
      />
    );
  }

  private static getDataKey(regionName: RegionName) {
    return `${regionName}_token_price`;
  }

  private static renderLine(index: number, regionName: RegionName) {
    return (
      <Line
        key={index}
        name={regionName}
        dataKey={(item: ILineItemOpen) => item.data[TokenHistoryGraph.getDataKey(regionName)]}
        animationDuration={500}
        animationEasing={"ease-in-out"}
        type={"basis"}
      />
    );
  }

  public render() {
    const { regionTokenHistories } = this.props;

    switch (regionTokenHistories.level) {
      case FetchLevel.success:
        break;
      case FetchLevel.failure:
        return <p>Failed to fetch token-histories!</p>;
      case FetchLevel.fetching:
      default:
        return <p>Fetching regional token-histories...</p>;
    }

    const data = convertRegionTokenHistoriesToLineData(regionTokenHistories.data);

    return (
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid vertical={false} strokeWidth={0.25} strokeOpacity={0.25} />
          {TokenHistoryGraph.renderXAxis()}
          {TokenHistoryGraph.renderYAxis()}
          {this.renderLines()}
        </LineChart>
      </ResponsiveContainer>
    );
  }

  private renderLines() {
    const { regionTokenHistories } = this.props;

    return Object.keys(regionTokenHistories).map((v, i) => TokenHistoryGraph.renderLine(i, v));
  }
}
