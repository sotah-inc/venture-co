import React from "react";

import { Icon, Intent, Tag } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { IShortTokenHistory, RegionName } from "@sotah-inc/core";
import moment from "moment";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { IFetchData, ILineItemOpen, IRegions } from "../../../types/global";
import { FetchLevel } from "../../../types/main";
import {
  convertTokenHistoriesToLineData,
  currencyToText,
  getColor,
  unixTimestampToText,
  zeroGraphValue,
} from "../../../util";

export interface IStateProps {
  tokenHistories: IFetchData<IShortTokenHistory>;
  regions: IRegions;
}

type Props = Readonly<IStateProps>;

type State = Readonly<{
  highlightedRegionName: RegionName | null;
}>;

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

export class TokenHistoryGraph extends React.Component<Props, State> {
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

            return result;
          },
          dataMax => {
            if (dataMax <= 1) {
              return 10;
            }

            const result = Math.pow(10, Math.floor(Math.log10(dataMax)));

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

  private static getDataKey(regionName: RegionName) {
    return `${regionName}_token_price`;
  }

  public state: State = {
    highlightedRegionName: null,
  };

  public componentDidMount() {
    this.setState({
      highlightedRegionName: null,
    });
  }

  public render() {
    const { tokenHistories } = this.props;

    switch (tokenHistories.level) {
      case FetchLevel.success:
        break;
      case FetchLevel.failure:
        return <p>Failed to fetch token-histories!</p>;
      case FetchLevel.fetching:
      default:
        return <p>Fetching regional token-histories...</p>;
    }

    const data = convertTokenHistoriesToLineData(tokenHistories.data).filter(
      v => v.name > moment(roundedEarliestDateLimit).add(1, "day").unix(),
    );

    return (
      <>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid vertical={false} strokeWidth={0.25} strokeOpacity={0.25} />
            {TokenHistoryGraph.renderXAxis()}
            {TokenHistoryGraph.renderYAxis()}
            {this.renderLines()}
          </LineChart>
        </ResponsiveContainer>
        {this.renderLegend()}
      </>
    );
  }

  private renderLegendColumn(regionIndexTuples: Array<[RegionName, number]>, index: number) {
    return (
      <div className="pure-u-1-2" key={index}>
        <div style={index < 1 ? { marginRight: "10px" } : {}}>
          {regionIndexTuples.map(([regionName, originalIndex], i) =>
            this.renderLegendColumnTag(regionName, originalIndex, i),
          )}
        </div>
      </div>
    );
  }

  private renderLegendColumnTag(regionName: RegionName, originalIndex: number, i: number) {
    const { intent, rightIcon, interactive } = (() => {
      const rightIconElement = <Icon icon={IconNames.CHART} color={getColor(originalIndex)} />;

      return { intent: Intent.NONE, rightIcon: rightIconElement, interactive: false };
    })();

    return (
      <Tag
        fill={true}
        key={i}
        minimal={true}
        style={{ marginBottom: "5px" }}
        intent={intent}
        rightIcon={rightIcon}
        interactive={interactive}
        onMouseEnter={() => {
          this.setState({ ...this.state, highlightedRegionName: regionName });
        }}
        onMouseLeave={() => {
          this.setState({ ...this.state, highlightedRegionName: null });
        }}
      >
        {this.renderLegendItem(regionName)}
      </Tag>
    );
  }

  private renderLegendItem(regionName: RegionName) {
    return <span>{regionName.toUpperCase()}</span>;
  }

  private renderLine(index: number, regionName: RegionName) {
    const { highlightedRegionName } = this.state;

    const { stroke, strokeWidth } = (() => {
      if (highlightedRegionName === null || highlightedRegionName === regionName) {
        return {
          stroke: getColor(index),
          strokeWidth: highlightedRegionName === regionName ? 4 : 2,
        };
      }

      return {
        stroke: "#5C7080",
        strokeWidth: 1,
      };
    })();

    return (
      <Line
        key={index}
        name={regionName}
        dataKey={(item: ILineItemOpen) =>
          item.data[TokenHistoryGraph.getDataKey(regionName)] ?? null
        }
        animationDuration={500}
        animationEasing={"ease-in-out"}
        type={"basis"}
        connectNulls={true}
        stroke={stroke}
        strokeWidth={strokeWidth}
        dot={false}
      />
    );
  }

  private renderLines() {
    const { regions } = this.props;

    return Object.keys(regions).map((v, i) => this.renderLine(i, v));
  }

  private renderLegend() {
    const { regions } = this.props;

    const groupedRegionNames = Object.keys(regions).reduce<Array<Array<[RegionName, number]>>>(
      (result, v, i) => {
        const column = i % 2;
        if (Object.keys(result).indexOf(column.toString()) === -1) {
          result[column] = [];
        }

        result[column].push([v, i]);

        return result;
      },
      [],
    );

    return (
      <div className="pure-g">
        {groupedRegionNames.map((v, i) => this.renderLegendColumn(v, i))}
      </div>
    );
  }
}
