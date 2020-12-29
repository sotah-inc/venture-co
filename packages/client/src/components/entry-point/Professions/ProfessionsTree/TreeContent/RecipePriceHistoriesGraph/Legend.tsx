import React from "react";

import { Icon, Intent, Tag } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { ItemId } from "@sotah-inc/core";

import { getColor, getItemIconUrl, qualityToColorClass } from "../../../../../../util";
import { ItemLink } from "../../../../../util/ItemLink";
import {
  ICraftingCostLegendOptions,
  resolveItemDataKey,
  TabKind,
  TotalReagentCostDataKey,
} from "./common";

// props
export interface IOwnProps {
  currentTabKind: TabKind;

  craftingCostOptions: ICraftingCostLegendOptions;
}

export type Props = Readonly<IOwnProps>;

export class Legend extends React.Component<Props> {
  public render() {
    const { currentTabKind } = this.props;

    switch (currentTabKind) {
      case TabKind.craftingCost:
        return this.renderCraftingCostLegend();
      case TabKind.reagentPrices:
      default:
        return null;
    }
  }

  private renderCraftingCostLegend() {
    const {
      craftingCostOptions: { recipeItems },
    } = this.props;

    const groupedItemIds = recipeItems
      .map(v => v.id)
      .reduce<Array<Array<[ItemId, number]>>>((result, v, i) => {
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
    const {
      craftingCostOptions: {
        highlightedDataKey,
        recipeItemsSelected,
        totalReagentCostSelected,
        onDataKeyHighlight,
        onTotalReagentCostSelect,
      },
    } = this.props;

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
        onMouseEnter={() => onDataKeyHighlight(TotalReagentCostDataKey)}
        onMouseLeave={() => onDataKeyHighlight(null)}
        onClick={onTotalReagentCostSelect}
      >
        Total Reagent Cost
      </Tag>
    );
  }

  private renderLegendColumnTag(itemId: ItemId, colorIndex: number, keyIndex: number) {
    const {
      craftingCostOptions: {
        highlightedDataKey,
        recipeItemsSelected,
        totalReagentCostSelected,
        onDataKeyHighlight,
        onRecipeItemSelect,
      },
    } = this.props;

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
        onMouseEnter={() => onDataKeyHighlight(resolveItemDataKey(itemId))}
        onMouseLeave={() => onDataKeyHighlight(null)}
        onClick={() => onRecipeItemSelect(itemId)}
      >
        {this.renderLegendItem(itemId)}
      </Tag>
    );
  }

  private renderLegendItemIcon(itemId: ItemId) {
    const {
      craftingCostOptions: { recipeItems },
    } = this.props;

    const foundItem = recipeItems.find(v => v.id === itemId);
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
    const {
      craftingCostOptions: { recipeItems, onRecipeItemSelect },
    } = this.props;

    const foundItem = recipeItems.find(v => v.id === itemId);
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
        onItemClick={() => onRecipeItemSelect(itemId)}
        interactive={false}
      />
    );
  }

  private renderSelectAllTag() {
    const {
      craftingCostOptions: { totalReagentCostSelected, recipeItemsSelected, onReset },
    } = this.props;

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

          onReset();
        }}
      >
        Select All
      </Tag>
    );
  }
}
