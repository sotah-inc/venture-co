import React from "react";

import { Icon, Intent, Position, Tab, Tabs, Tag } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import {
  IItemPriceLimits,
  IItemPricelistHistoryMap,
  IItemsMap,
  IPriceLimits,
  IPricesFlagged,
  ItemId,
} from "@sotah-inc/core";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { ItemPopoverContainer } from "../../containers/util/ItemPopover";
import { ILineItemOpen } from "../../types/global";
import {
  convertPricelistHistoryMapToLineData,
  currencyToText,
  getColor,
  getXAxisTimeRestrictions,
  qualityToColorClass,
  unixTimestampToText,
  zeroGraphValue,
} from "../../util";

export interface IOwnProps {
  items: IItemsMap;
  pricelistHistoryMap: IItemPricelistHistoryMap<IPricesFlagged>;
  overallPriceLimits: IPriceLimits;
  itemPriceLimits: IItemPriceLimits;
  loadId: string;
}

type Props = Readonly<IOwnProps>;

enum TabKind {
  prices = "prices",
  volume = "volume",
}

type State = Readonly<{
  currentTabKind: TabKind;
  highlightedItemId: ItemId | null;
  selectedItems: Set<ItemId>;
}>;

export class PricelistHistoryGraph extends React.Component<Props, State> {
  public state: State = {
    currentTabKind: TabKind.prices,
    highlightedItemId: null,
    selectedItems: new Set<ItemId>(),
  };

  public componentDidMount() {
    this.setState({
      currentTabKind: TabKind.prices,
      highlightedItemId: null,
      selectedItems: new Set<ItemId>(),
    });
  }

  public componentDidUpdate(prevProps: Props): void {
    const { loadId } = this.props;

    if (prevProps.loadId !== loadId) {
      this.setState({
        currentTabKind: TabKind.prices,
        highlightedItemId: null,
        selectedItems: new Set<ItemId>(),
      });
    }
  }

  public render() {
    const { currentTabKind } = this.state;

    return (
      <>
        <div style={{ marginBottom: "10px" }}>
          <Tabs
            id="history-tabs"
            selectedTabId={currentTabKind}
            onChange={(tabKind: TabKind) => this.setState({ currentTabKind: tabKind })}
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
    const { overallPriceLimits, itemPriceLimits } = this.props;
    const { currentTabKind, selectedItems, highlightedItemId } = this.state;

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
        const preferredLimits: IPriceLimits = (() => {
          if (selectedItems.size === 0) {
            return overallPriceLimits;
          }

          const activeItemIds =
            highlightedItemId === null
              ? Array.from(selectedItems)
              : [...Array.from(selectedItems), highlightedItemId];

          return activeItemIds
            .map<IPriceLimits>(v => {
              let { lower, upper } = itemPriceLimits[Number(v)];

              lower = Math.pow(10, Math.floor(Math.log10(lower)));
              if (lower === 0) {
                lower = zeroGraphValue;
              }

              if (upper <= 1) {
                upper = 10;
              }
              upper = Math.pow(10, Math.ceil(Math.log10(upper)));

              return { lower, upper };
            })
            .reduce<IPriceLimits>(
              (result, v) => {
                if (result.lower === zeroGraphValue || v.lower < result.lower) {
                  result.lower = v.lower;
                }

                if (v.upper > result.upper) {
                  result.upper = v.upper;
                }

                return result;
              },
              { lower: zeroGraphValue, upper: 0 },
            );
        })();

        if (preferredLimits.upper > overallPriceLimits.upper) {
          preferredLimits.upper = overallPriceLimits.upper;
        }

        return (
          <YAxis
            tickFormatter={v => currencyToText(v * 10 * 10)}
            domain={[preferredLimits.lower / 10 / 10, preferredLimits.upper / 10 / 10]}
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

    const data = convertPricelistHistoryMapToLineData(pricelistHistoryMap);
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
      <>
        <div className="pure-g">
          <div className="pure-u-1-3">
            <div style={{ marginRight: "10px" }}>{this.renderSelectAll()}</div>
          </div>
        </div>
        <div className="pure-g pricelist-history-graph-legend">
          {groupedItemIds.map((v, i) => this.renderLegendColumn(v, i))}
        </div>
      </>
    );
  }

  private renderSelectAll() {
    const { selectedItems } = this.state;

    const canSelectAll = selectedItems.size > 0;

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

          this.setState({ ...this.state, selectedItems: new Set<ItemId>() });
        }}
      >
        Select All
      </Tag>
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
    const { pricelistHistoryMap } = this.props;
    const { selectedItems, highlightedItemId } = this.state;

    const hasData = Object.keys(pricelistHistoryMap[itemId]).reduce<boolean>((result, v) => {
      if (result) {
        return result;
      }

      return !pricelistHistoryMap[itemId][Number(v)].is_blank;
    }, false);

    const { intent, rightIcon, interactive } = (() => {
      if (!hasData) {
        return {
          intent: Intent.NONE,
          interactive: false,
          rightIcon: <Icon icon={IconNames.EYE_OFF} />,
        };
      }

      const rightIconElement = <Icon icon={IconNames.CHART} color={getColor(originalIndex)} />;

      if (selectedItems.size === 0 || selectedItems.has(itemId)) {
        return {
          intent: Intent.PRIMARY,
          interactive: true,
          rightIcon: rightIconElement,
        };
      }

      return { intent: Intent.NONE, rightIcon: rightIconElement, interactive: true };
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
        active={highlightedItemId !== null && highlightedItemId === itemId}
        onMouseEnter={() => {
          if (!hasData) {
            return;
          }

          this.setState({ ...this.state, highlightedItemId: itemId });
        }}
        onMouseLeave={() => {
          if (!hasData) {
            return;
          }

          this.setState({ ...this.state, highlightedItemId: null });
        }}
        onClick={() => {
          if (!hasData) {
            return;
          }

          this.onLegendItemClick(itemId);
        }}
      >
        {this.renderLegendItem(itemId, hasData)}
      </Tag>
    );
  }

  private renderLegendItem(itemId: ItemId, hasData: boolean) {
    const { items } = this.props;

    const foundItem = items[itemId];

    if (typeof foundItem === "undefined") {
      return itemId;
    }

    return (
      <ItemPopoverContainer
        item={foundItem}
        itemTextFormatter={text => (
          <span className={qualityToColorClass(foundItem.quality)}>{text}</span>
        )}
        position={Position.BOTTOM}
        onItemClick={() => {
          if (!hasData) {
            return;
          }

          this.onLegendItemClick(foundItem.id);
        }}
        interactive={hasData}
      />
    );
  }

  private onLegendItemClick(itemId: ItemId) {
    const { selectedItems } = this.state;

    const nextSelectedItems: Set<ItemId> = (() => {
      if (selectedItems.has(itemId)) {
        return selectedItems;
      }

      return new Set<ItemId>([...Array.from(selectedItems), itemId]);
    })();

    this.setState({ ...this.state, selectedItems: nextSelectedItems });
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
    const { items, pricelistHistoryMap } = this.props;
    const { highlightedItemId, selectedItems } = this.state;

    const hasData = Object.keys(pricelistHistoryMap[itemId]).reduce<boolean>((result, v) => {
      if (result) {
        return result;
      }

      return !pricelistHistoryMap[itemId][Number(v)].is_blank;
    }, false);

    const { stroke, strokeWidth } = (() => {
      if (highlightedItemId === null || highlightedItemId === itemId) {
        return {
          stroke: getColor(index),
          strokeWidth: highlightedItemId === itemId ? 4 : 2,
        };
      }

      return {
        stroke: "#5C7080",
        strokeWidth: 1,
      };
    })();

    const opacity = (() => {
      if (selectedItems.size === 0) {
        if (highlightedItemId !== null && itemId !== highlightedItemId) {
          return 0.5;
        }

        return 1;
      }

      if (!selectedItems.has(itemId)) {
        if (highlightedItemId !== null && itemId === highlightedItemId) {
          return 0.5;
        }

        return 0;
      }

      if (highlightedItemId !== null && itemId !== highlightedItemId) {
        return 0.5;
      }

      return 1;
    })();

    const dot = highlightedItemId === itemId || selectedItems.has(itemId);

    return (
      <Line
        key={index}
        name={items[itemId]?.name ?? itemId.toString()}
        dataKey={(item: ILineItemOpen) => item.data[this.getDataKey(itemId)]}
        stroke={stroke}
        strokeWidth={strokeWidth}
        dot={dot}
        animationDuration={500}
        animationEasing={"ease-in-out"}
        opacity={opacity}
        onMouseEnter={() => {
          if (!hasData || opacity === 0) {
            return;
          }

          this.setState({ ...this.state, highlightedItemId: itemId });
        }}
        onMouseLeave={() => {
          if (!hasData || opacity === 0) {
            return;
          }

          this.setState({ ...this.state, highlightedItemId: null });
        }}
        onClick={() => {
          if (!hasData || opacity === 0) {
            return;
          }

          this.onLegendItemClick(itemId);
        }}
        type={"basis"}
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
