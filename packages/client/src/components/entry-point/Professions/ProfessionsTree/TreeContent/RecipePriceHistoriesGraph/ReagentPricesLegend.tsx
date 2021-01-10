import React from "react";

import { Icon, Intent, Tag } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { IShortItem, ItemId } from "@sotah-inc/core";

import { getColor, getItemIconUrl, qualityToColorClass } from "../../../../../../util";
import { ItemLink } from "../../../../../util/ItemLink";
import { resolveItemDataKey } from "./common";

// props
export interface IOwnProps {
  items: IShortItem[];
  itemIds: ItemId[];
  highlightedDataKey: string | null;

  onDataKeyHighlight: (dataKey: string | null) => void;
}

export type Props = Readonly<IOwnProps>;

export class ReagentPricesLegend extends React.Component<Props> {
  public render() {
    const { itemIds } = this.props;

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
        <div className="pure-g reagent-prices-legend">
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
            this.renderLegendColumnTag(itemId, originalIndex, keyIndex),
          )}
        </div>
      </div>
    );
  }

  private renderLegendColumnTag(itemId: ItemId, colorIndex: number, keyIndex: number) {
    const { onDataKeyHighlight, highlightedDataKey } = this.props;

    return (
      <Tag
        fill={true}
        key={keyIndex}
        minimal={true}
        interactive={true}
        style={{ marginBottom: "5px" }}
        intent={Intent.PRIMARY}
        icon={this.renderLegendItemIcon(itemId)}
        rightIcon={<Icon icon={IconNames.CHART} color={getColor(colorIndex)} />}
        active={highlightedDataKey === resolveItemDataKey(itemId)}
        onMouseEnter={() => onDataKeyHighlight(resolveItemDataKey(itemId))}
        onMouseLeave={() => onDataKeyHighlight(null)}
      >
        {this.renderLegendItem(itemId)}
      </Tag>
    );
  }

  private renderLegendItemIcon(itemId: ItemId) {
    const { items } = this.props;

    const foundItem = items.find(v => v.id === itemId);
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
    const { items } = this.props;

    const foundItem = items.find(v => v.id === itemId);
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
        interactive={false}
      />
    );
  }
}
