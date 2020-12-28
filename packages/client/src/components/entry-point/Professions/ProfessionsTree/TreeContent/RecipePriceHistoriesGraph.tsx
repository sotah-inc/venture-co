import React from "react";

import { Callout, H4, Icon, Intent, Tag } from "@blueprintjs/core";
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
  getItemIconUrl,
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
  recipeItemsSelected: Set<number>;
  totalReagentCostSelected: boolean;
}>;

const TotalReagentCostDataKey = "total_reagent_cost";

function resolveItemDataKey(id: ItemId): string {
  return `${id}_buyout_per`;
}

export class RecipePriceHistoriesGraph extends React.Component<Props, State> {
  public state: State = {
    highlightedDataKey: null,
    recipeItemsSelected: new Set<ItemId>(),
    totalReagentCostSelected: false,
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
        <H4>History</H4>
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
        <Callout intent={Intent.PRIMARY} style={{ marginBottom: "10px" }}>
          Price graph is of average prices.
        </Callout>
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
            <div style={{ marginRight: "10px" }}>{this.renderSelectAllTag()}</div>
          </div>
          <div className="pure-u-1-3">
            <div style={{ marginRight: "10px" }}>{this.renderLegendReagentTotalCostTag(0)}</div>
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
          {itemIdIndexTuples.map(([itemId, originalIndex], keyIndex) =>
            this.renderLegendColumnTag(itemId, originalIndex + 1, keyIndex),
          )}
        </div>
      </div>
    );
  }

  private renderLegendReagentTotalCostTag(colorIndex: number) {
    const { highlightedDataKey, recipeItemsSelected, totalReagentCostSelected } = this.state;

    const intent =
      recipeItemsSelected.size > 0 && !totalReagentCostSelected ? Intent.NONE : Intent.PRIMARY;

    return (
      <Tag
        fill={true}
        minimal={true}
        interactive={true}
        style={{ marginBottom: "5px" }}
        intent={intent}
        rightIcon={<Icon icon={IconNames.CHART} color={getColor(colorIndex)} />}
        active={highlightedDataKey === TotalReagentCostDataKey}
        onMouseEnter={() => {
          this.setState({ ...this.state, highlightedDataKey: TotalReagentCostDataKey });
        }}
        onMouseLeave={() => {
          this.setState({ ...this.state, highlightedDataKey: null });
        }}
        onClick={() => {
          this.setState({ ...this.state, totalReagentCostSelected: true });
        }}
      >
        Total Reagent Cost
      </Tag>
    );
  }

  private renderLegendColumnTag(itemId: ItemId, colorIndex: number, keyIndex: number) {
    const { highlightedDataKey, recipeItemsSelected, totalReagentCostSelected } = this.state;

    const hasSelections = recipeItemsSelected.size > 0 || totalReagentCostSelected;

    const intent = !hasSelections || recipeItemsSelected.has(itemId) ? Intent.PRIMARY : Intent.NONE;

    return (
      <Tag
        fill={true}
        key={keyIndex}
        minimal={true}
        interactive={true}
        style={{ marginBottom: "5px" }}
        intent={intent}
        icon={this.renderLegendItemIcon(itemId)}
        rightIcon={<Icon icon={IconNames.CHART} color={getColor(colorIndex)} />}
        active={highlightedDataKey === resolveItemDataKey(itemId)}
        onMouseEnter={() => {
          this.setState({ ...this.state, highlightedDataKey: resolveItemDataKey(itemId) });
        }}
        onMouseLeave={() => {
          this.setState({ ...this.state, highlightedDataKey: null });
        }}
        onClick={() => {
          recipeItemsSelected.add(itemId);
          this.setState({ ...this.state, recipeItemsSelected });
        }}
      >
        {this.renderLegendItem(itemId)}
      </Tag>
    );
  }

  private renderLegendItemIcon(itemId: ItemId) {
    const { selectedRecipe } = this.props;

    if (selectedRecipe === null || typeof selectedRecipe === "undefined") {
      return null;
    }

    const foundItem = selectedRecipe.items.find(v => v.id === itemId);
    if (typeof foundItem === "undefined") {
      return null;
    }

    const itemIconUrl = getItemIconUrl(foundItem);
    if (itemIconUrl === null) {
      return null;
    }

    return <img src={itemIconUrl} className="item-icon" alt="" />;
  }

  private renderLegendItem(itemId: ItemId) {
    const { selectedRecipe } = this.props;
    const { recipeItemsSelected } = this.state;

    if (selectedRecipe === null || typeof selectedRecipe === "undefined") {
      return null;
    }

    const foundItem = selectedRecipe.items.find(v => v.id === itemId);
    if (typeof foundItem === "undefined") {
      return itemId;
    }

    return (
      <ItemLink
        showIcon={false}
        item={foundItem}
        itemTextFormatter={text => (
          <span className={qualityToColorClass(foundItem.quality.type)}>{text}</span>
        )}
        onItemClick={() => {
          recipeItemsSelected.add(itemId);
          this.setState({ ...this.state, recipeItemsSelected });
        }}
        interactive={false}
      />
    );
  }

  private renderSelectAllTag() {
    const { totalReagentCostSelected, recipeItemsSelected } = this.state;

    const canSelectAll = totalReagentCostSelected || recipeItemsSelected.size > 0;

    return (
      <Tag
        fill={true}
        minimal={true}
        interactive={canSelectAll}
        style={{ marginBottom: "5px" }}
        intent={canSelectAll ? Intent.PRIMARY : Intent.NONE}
        icon={IconNames.DOUBLE_CHEVRON_UP}
        onClick={() => {
          if (!canSelectAll) {
            return;
          }

          this.setState({
            ...this.state,
            recipeItemsSelected: new Set<ItemId>(),
            totalReagentCostSelected: false,
          });
        }}
      >
        Select All
      </Tag>
    );
  }

  private renderLine(dataKey: string, index: number) {
    const { highlightedDataKey, totalReagentCostSelected, recipeItemsSelected } = this.state;
    const {
      selectedRecipe,
      recipePriceHistories: {
        data: { recipeItemIds },
      },
    } = this.props;

    if (selectedRecipe === null || typeof selectedRecipe === "undefined") {
      return null;
    }

    const hasSelections = recipeItemsSelected.size > 0 || totalReagentCostSelected;

    const isSelected = ((): boolean => {
      if (dataKey === TotalReagentCostDataKey) {
        return totalReagentCostSelected;
      }

      const recipeItemDataKeys = recipeItemIds[selectedRecipe.data.id].map(resolveItemDataKey);
      if (recipeItemDataKeys.includes(dataKey)) {
        const selectedRecipeItemDataKeys = Array.from(recipeItemsSelected).map(resolveItemDataKey);

        return selectedRecipeItemDataKeys.includes(dataKey);
      }

      return false;
    })();

    const hasHighlightButNotHighlighted =
      highlightedDataKey !== null && dataKey !== highlightedDataKey;

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

    const dot = highlightedDataKey === dataKey || isSelected;

    const opacity = (() => {
      if (!hasSelections) {
        return hasHighlightButNotHighlighted ? 0.5 : 1;
      }

      if (!isSelected) {
        if (highlightedDataKey !== null && highlightedDataKey === dataKey) {
          return 1;
        }

        return hasHighlightButNotHighlighted ? 0.5 : 0;
      }

      return hasHighlightButNotHighlighted ? 0.5 : 1;
    })();

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
        opacity={opacity}
        onMouseEnter={() => {
          this.setState({ ...this.state, highlightedDataKey: dataKey });
        }}
        onMouseLeave={() => {
          this.setState({ ...this.state, highlightedDataKey: null });
        }}
        connectNulls={true}
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
      TotalReagentCostDataKey,
      ...recipeItemIds[selectedRecipe.data.id].map(resolveItemDataKey),
    ];

    return dataKeys.map((v, i) => this.renderLine(v, i));
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
