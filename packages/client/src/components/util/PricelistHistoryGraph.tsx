import React from "react";

import { Alignment, ControlGroup, Switch, Tab, Tabs } from "@blueprintjs/core";
import {
  IItemPricelistHistoryMap,
  IItemsMap,
  IPriceLimits,
  IPricelistHistoryMap,
  ItemId,
} from "@sotah-inc/core";
import moment from "moment";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { currencyToText, getColor, unixTimestampToText } from "../../util";
import { ItemIcon } from "./ItemIcon";

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
        {this.renderLegend()}
      </>
    );
  }

  private renderLegend() {
    const { pricelistHistoryMap } = this.props;

    const itemIds: ItemId[] = Object.keys(pricelistHistoryMap).map(Number);

    const groupedItemIds = itemIds.reduce<Array<Array<[ItemId, number]>>>((result, v, i) => {
      const column = i % 3;
      if (Object.keys(result).indexOf(column.toString()) === -1) {
        result[column] = [];
      }

      result[column].push([v, i]);

      return result;
    }, []);

    return (
      <div className="pure-g pricelist-history-graph-legend">
        {groupedItemIds.map((v, i) => this.renderLegendColumn(v, i))}
      </div>
    );
  }

  private renderLegendColumn(itemIdIndexTuples: Array<[ItemId, number]>, index: number) {
    return (
      <div className="pure-u-1-3" key={index}>
        <div style={index < 2 ? { marginRight: "10px" } : {}}>
          <ControlGroup vertical={true}>
            {itemIdIndexTuples.map((v, i) => (
              <Switch key={i} alignIndicator={Alignment.RIGHT} checked={true}>
                {this.renderLegendItem(...v)}
              </Switch>
            ))}
          </ControlGroup>
        </div>
      </div>
    );
  }

  private renderLegendItem(itemId: ItemId, originalIndex: number) {
    const { items } = this.props;

    const foundItem = items[itemId];

    if (typeof foundItem === "undefined") {
      return itemId;
    }

    return (
      <>
        <ItemIcon item={foundItem} />{" "}
        <span style={{ color: getColor(originalIndex) }}>{foundItem.name}</span>
      </>
    );
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
    const { items } = this.props;

    return (
      <Line
        key={index}
        name={items[itemId]?.name ?? itemId.toString()}
        dataKey={this.getDataKey(itemId)}
        stroke={getColor(index)}
        dot={false}
        animationDuration={500}
        animationEasing={"ease-in-out"}
      />
    );
  }

  private renderLines() {
    const { pricelistHistoryMap: data } = this.props;

    return Object.keys(data).map((itemIdKey: string, index: number) =>
      this.renderLine(index, Number(itemIdKey)),
    );
  }
}
