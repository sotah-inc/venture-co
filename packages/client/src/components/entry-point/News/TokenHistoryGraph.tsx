import React from "react";

import { RegionName } from "@sotah-inc/core";
import moment from "moment";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { IFetchData, ILineItemOpen } from "../../../types/global";
import { FetchLevel } from "../../../types/main";
import { IRegionTokenHistories } from "../../../types/posts";
import {
  convertRegionTokenHistoriesToLineData,
  currencyToText,
  unixTimestampToText,
  zeroGraphValue,
} from "../../../util";

export interface IStateProps {
  regionTokenHistories: IFetchData<IRegionTokenHistories>;
}

type Props = Readonly<IStateProps>;

export class TokenHistoryGraph extends React.Component<Props> {
  private static renderXAxis() {
    const earlilestDateLimit = moment().subtract(2, "days");
    const roundedEarliestDateLimit = moment()
      .subtract(4, "days")
      .subtract(earlilestDateLimit.hours(), "hours")
      .subtract(earlilestDateLimit.minutes(), "minutes")
      .subtract(earlilestDateLimit.seconds(), "seconds");
    const nowDate = moment().add(1, "days");
    const roundedNowDate = moment()
      .add(1, "days")
      .subtract(nowDate.hours(), "hours")
      .subtract(nowDate.minutes(), "minutes")
      .subtract(nowDate.seconds(), "seconds")
      .add(12, "hours");

    const xAxisTicks = Array.from(Array(3)).map((_, i) => {
      return roundedEarliestDateLimit.unix() + i * 60 * 60 * 24 * 2;
    });

    return (
      <XAxis
        dataKey="name"
        tickFormatter={unixTimestampToText}
        domain={[roundedEarliestDateLimit.unix(), roundedNowDate.unix()]}
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
        connectNulls={true}
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

    // tslint:disable-next-line:no-console
    console.log(data);

    return (
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid vertical={false} strokeWidth={0.25} strokeOpacity={0.25} />
          <Legend />
          {TokenHistoryGraph.renderXAxis()}
          {TokenHistoryGraph.renderYAxis()}
          {this.renderLines()}
        </LineChart>
      </ResponsiveContainer>
    );
  }

  private renderLines() {
    const { regionTokenHistories } = this.props;

    return Object.keys(regionTokenHistories.data).map((v, i) => TokenHistoryGraph.renderLine(i, v));
  }
}
