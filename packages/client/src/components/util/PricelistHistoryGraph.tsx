import React from "react";

import { Tab, Tabs } from "@blueprintjs/core";
import {
  IItemPricelistHistoryMap,
  IItemsMap,
  IPriceLimits,
  IPricelistHistoryMap,
  ItemId,
} from "@sotah-inc/core";
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

import { currencyToText, getColor, unixTimestampToText } from "../../util";

export interface IOwnProps {
  items: IItemsMap;
  pricelistHistoryMap: IItemPricelistHistoryMap;
  overallPriceLimits: IPriceLimits;
}

interface ILineItem {
  name: number;
  [dataKey: string]: number;
}

type Props = Readonly<IOwnProps>;

type State = Readonly<{
  currentTabKind: string;
}>;

enum TabKind {
  prices = "prices",
  volume = "volume",
}

const zeroGraphValue = 0.1;

export class PricelistHistoryGraph extends React.Component<Props, State> {
  public state: State = {
    currentTabKind: TabKind.prices,
  };

  public render() {
    const { currentTabKind } = this.state;

    return (
      <>
        <div style={{ marginBottom: "10px" }}>
          <Tabs
            id="history-tabs"
            selectedTabId={currentTabKind}
            onChange={tabKind => this.setState({ currentTabKind: tabKind.toString() })}
          >
            <Tab id={TabKind.prices} title="Prices" />
            <Tab id={TabKind.volume} title="Volume" />
          </Tabs>
        </div>
        <div style={{ marginBottom: "10px" }}>{this.renderContent()}</div>
      </>
    );
  }

  private renderYAxis() {
    const { overallPriceLimits } = this.props;
    const { currentTabKind } = this.state;

    switch (currentTabKind) {
      case TabKind.volume:
        return (
          <YAxis
            tickFormatter={v => {
              if (v === zeroGraphValue) {
                return 0;
              }

              return Number(v).toLocaleString();
            }}
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
      case TabKind.prices:
      default:
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

  private renderContent() {
    const { pricelistHistoryMap } = this.props;

    const data = Object.keys(pricelistHistoryMap).reduce<ILineItem[]>(
      (dataPreviousValue: ILineItem[], itemIdKey: string) => {
        const itemPricelistHistory: IPricelistHistoryMap = pricelistHistoryMap[Number(itemIdKey)];
        const itemId = Number(itemIdKey);

        return Object.keys(itemPricelistHistory).reduce(
          (previousValue: ILineItem[], unixTimestampKey) => {
            const unixTimestamp = Number(unixTimestampKey);
            const prices = itemPricelistHistory[unixTimestamp];

            const buyoutValue: number = (() => {
              if (prices.min_buyout_per === 0) {
                return zeroGraphValue;
              }

              return prices.min_buyout_per / 10 / 10;
            })();
            const volumeValue: number = (() => {
              if (prices.volume === 0) {
                return zeroGraphValue;
              }

              return prices.volume;
            })();

            previousValue.push({
              name: unixTimestamp,
              [`${itemId}_buyout`]: buyoutValue,
              [`${itemId}_volume`]: volumeValue,
            });

            return previousValue;
          },
          dataPreviousValue,
        );
      },
      [],
    );

    const twoWeeksAgoDate = moment().subtract(14, "days");
    const roundedTwoWeeksAgoDate = moment()
      .subtract(16, "days")
      .subtract(twoWeeksAgoDate.hours(), "hours")
      .subtract(twoWeeksAgoDate.minutes(), "minutes")
      .subtract(twoWeeksAgoDate.seconds(), "seconds");
    const nowDate = moment().add(1, "days");
    const roundedNowDate = moment()
      .add(1, "days")
      .subtract(nowDate.hours(), "hours")
      .subtract(nowDate.minutes(), "minutes")
      .subtract(nowDate.seconds(), "seconds")
      .add(12, "hours");

    const xAxisTicks = Array.from(Array(9)).map((_, i) => {
      return roundedTwoWeeksAgoDate.unix() + i * 60 * 60 * 24 * 2;
    });

    return (
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
          <Legend />
          {this.renderLines(pricelistHistoryMap)}
        </LineChart>
      </ResponsiveContainer>
    );
  }

  private getItem(itemId: ItemId) {
    const { items } = this.props;

    if (itemId in items) {
      return items[itemId];
    }

    return null;
  }

  private getDataKey(itemId: ItemId) {
    const { currentTabKind } = this.state;

    switch (currentTabKind) {
      case TabKind.volume:
        return `${itemId}_volume`;
      case TabKind.prices:
      default:
        return `${itemId}_buyout`;
    }
  }

  private renderLine(index: number, itemId: ItemId) {
    let name: string = itemId.toString();
    const item = this.getItem(itemId);
    if (item !== null) {
      name = item.name;
    }

    return (
      <Line
        key={index}
        name={name}
        dataKey={this.getDataKey(itemId)}
        stroke={getColor(index)}
        dot={false}
        animationDuration={500}
        animationEasing={"ease-in-out"}
      />
    );
  }

  private renderLines(data: IItemPricelistHistoryMap) {
    return Object.keys(data).map((itemIdKey: string, index: number) =>
      this.renderLine(index, Number(itemIdKey)),
    );
  }
}
