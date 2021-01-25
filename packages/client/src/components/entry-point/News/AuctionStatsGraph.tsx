import React from "react";

import { Icon, Intent, Tag } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { IQueryAuctionStatsResponseData } from "@sotah-inc/core";
import moment from "moment";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { IFetchData, ILineItemOpen } from "../../../types/global";
import { FetchLevel } from "../../../types/main";
import {
  convertAuctionStatsToLineData,
  currencyToText,
  getColor,
  unixTimestampToText,
  zeroGraphValue,
} from "../../../util";

export interface IStateProps {
  auctionStats: IFetchData<IQueryAuctionStatsResponseData>;
}

type Props = Readonly<IStateProps>;

const numberOfDays = 4;
const nowDate = moment();
const roundedEarliestDateLimit = moment()
  .subtract(nowDate.hours(), "hours")
  .subtract(nowDate.minutes(), "minutes")
  .subtract(nowDate.seconds(), "seconds")
  .subtract(numberOfDays, "days");
const roundedNowDate = moment()
  .subtract(nowDate.hours(), "hours")
  .subtract(nowDate.minutes(), "minutes")
  .subtract(nowDate.seconds(), "seconds")
  .add(1, "days");

export class AuctionStatsGraph extends React.Component<Props> {
  private static renderXAxis() {
    const xAxisTicks = Array.from(Array(numberOfDays + 2)).map(
      (_, i) => roundedEarliestDateLimit.unix() + i * 60 * 60 * 24,
    );

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
        tickFormatter={currencyToText}
        domain={[
          dataMin => {
            if (dataMin <= 1) {
              return zeroGraphValue;
            }

            const result = Math.pow(10, Math.floor(Math.log10(dataMin)));
            if (result === 0) {
              return zeroGraphValue;
            }

            return dataMin - (dataMin % result);
          },
          dataMax => {
            if (dataMax <= 1) {
              return 10;
            }

            const result = Math.pow(10, Math.floor(Math.log10(dataMax)));
            if (result === 0) {
              return zeroGraphValue;
            }

            return dataMax - (dataMax % result) + result;
          },
        ]}
        tick={{ fill: "#fff" }}
        scale="log"
        allowDataOverflow={true}
        mirror={true}
      />
    );
  }

  private static renderLegend() {
    return (
      <div className="pure-g">
        <div className="pure-u-1-1">
          <Tag
            fill={true}
            minimal={true}
            style={{ marginBottom: "5px" }}
            intent={Intent.NONE}
            rightIcon={<Icon icon={IconNames.CHART} color={getColor(0)} />}
            interactive={false}
          >
            Total Value of All Auctions
          </Tag>
        </div>
      </div>
    );
  }

  public render() {
    const { auctionStats } = this.props;

    switch (auctionStats.level) {
      case FetchLevel.success:
        break;
      case FetchLevel.failure:
        return <p>Failed to fetch auction-stats!</p>;
      case FetchLevel.fetching:
      default:
        return <p>Fetching auction-stats...</p>;
    }

    const data = convertAuctionStatsToLineData(auctionStats.data).filter(
      v => v.name > moment(roundedEarliestDateLimit).add(1, "day").unix(),
    );

    return (
      <>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid vertical={false} strokeWidth={0.25} strokeOpacity={0.25} />
            {AuctionStatsGraph.renderXAxis()}
            {AuctionStatsGraph.renderYAxis()}
            <Line
              name="Total Buyout"
              dataKey={(item: ILineItemOpen) => item.data["total_buyout"] ?? null}
              animationDuration={500}
              animationEasing={"ease-in-out"}
              type={"basis"}
              connectNulls={true}
              stroke={getColor(0)}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
        {AuctionStatsGraph.renderLegend()}
      </>
    );
  }
}
