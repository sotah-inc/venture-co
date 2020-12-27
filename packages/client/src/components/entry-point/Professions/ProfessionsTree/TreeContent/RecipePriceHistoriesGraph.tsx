import React from "react";

import { Icon, Intent, Tag } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
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
  qualityToColorClass,
  unixTimestampToText,
} from "../../../../../util";
import { ItemLink } from "../../../../util/ItemLink";

// props
export interface IStateProps {
  selectedRecipe: IItemsData<IShortRecipe> | null | undefined;
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
        {this.renderLegend()}
      </>
    );
  }

  private renderLegend() {
    const { recipePriceHistories, selectedRecipe } = this.props;

    if (selectedRecipe === null || typeof selectedRecipe === "undefined") {
      return null;
    }

    const itemIds: ItemId[] = recipePriceHistories.data.recipeItemIds[selectedRecipe.data.id];

    const groupedItemIds = itemIds.reduce<Array<Array<[ItemId, number]>>>((result, v, i) => {
      const column = i % 3;
      if (Object.keys(result).indexOf(column.toString()) === -1) {
        result[column] = [];
      }

      result[column].push([v, i]);

      return result;
    }, []);

    return (
      <>
        <div className="pure-g">
          <div className="pure-u-1-3">
            <div style={{ marginRight: "10px" }}>{this.renderSelectAll()}</div>
          </div>
        </div>
        <div className="pure-g recipe-price-histories-graph-legend">
          {groupedItemIds.map((v, i) => this.renderLegendColumn(v, i))}
        </div>
      </>
    );
  }

  private renderLegendColumn(itemIdIndexTuples: Array<[ItemId, number]>, index: number) {
    return (
      <div className="pure-u-1-3" key={index}>
        <div style={index < 2 ? { marginRight: "10px" } : {}}>
          {itemIdIndexTuples.map(([itemId, originalIndex], i) =>
            this.renderLegendColumnTag(itemId, originalIndex, i),
          )}
        </div>
      </div>
    );
  }

  private renderLegendColumnTag(itemId: ItemId, originalIndex: number, i: number) {
    const { intent, rightIcon, interactive } = (() => {
      const rightIconElement = <Icon icon={IconNames.CHART} color={getColor(originalIndex)} />;

      return {
        intent: Intent.PRIMARY,
        interactive: true,
        rightIcon: rightIconElement,
      };
    })();

    return (
      <Tag
        fill={true}
        key={i}
        minimal={true}
        interactive={interactive}
        style={{ marginBottom: "5px" }}
        intent={intent}
        rightIcon={rightIcon}
        active={true}
        onMouseEnter={() => {
          this.setState({ ...this.state, highlightedDataKey: `${itemId}_buyout_per` });
        }}
        onMouseLeave={() => {
          this.setState({ ...this.state, highlightedDataKey: null });
        }}
      >
        {this.renderLegendItem(itemId)}
      </Tag>
    );
  }

  private renderLegendItem(itemId: ItemId) {
    const { selectedRecipe } = this.props;

    if (selectedRecipe === null || typeof selectedRecipe === "undefined") {
      return null;
    }

    const foundItem = selectedRecipe.items.find(v => v.id === itemId);
    if (typeof foundItem === "undefined") {
      return itemId;
    }

    return (
      <ItemLink
        item={foundItem}
        itemTextFormatter={text => (
          <span className={qualityToColorClass(foundItem.quality.type)}>{text}</span>
        )}
        onItemClick={() => {
          // tslint:disable-next-line:no-console
          console.log("renderLegendItem().onItemClick()");
        }}
        interactive={false}
      />
    );
  }

  private renderSelectAll() {
    return (
      <Tag
        fill={true}
        minimal={true}
        interactive={false}
        style={{ marginBottom: "5px" }}
        intent={Intent.NONE}
        icon={IconNames.DOUBLE_CHEVRON_UP}
        onClick={() => {
          // tslint:disable-next-line:no-console
          console.log("renderSelectAll().onClick()");
        }}
      >
        Select All
      </Tag>
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
      selectedRecipe,
      recipePriceHistories: {
        data: { recipeItemIds },
      },
    } = this.props;

    if (selectedRecipe === null || typeof selectedRecipe === "undefined") {
      return null;
    }

    const dataKeys = [
      ...recipeItemIds[selectedRecipe.data.id].map(v => `${v}_buyout_per`),
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
