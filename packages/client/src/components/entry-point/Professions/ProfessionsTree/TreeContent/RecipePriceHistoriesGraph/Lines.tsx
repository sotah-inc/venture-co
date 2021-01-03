import React from "react";

import { Area, Line } from "recharts";

import { ILineItemOpen } from "../../../../../../types/global";
import { getColor } from "../../../../../../util";
import {
  ICraftingCostLinesOptions,
  IReagentPricesLinesOptions,
  resolveItemDataKey,
  TabKind,
  TotalReagentCostDataKey,
} from "./common";

// props
export interface IOwnProps {
  currentTabKind: TabKind;

  craftingCostOptions: ICraftingCostLinesOptions;
  reagentPricesOptions: IReagentPricesLinesOptions;
}

export type Props = Readonly<IOwnProps>;

function ReagentPricesLines(props: Props) {
  const dataKeys = props.reagentPricesOptions.reagentItemIds.map(v => `${v}_buyout`);

  return dataKeys.map((v, i) => ReagentPricesLine({ ...props, dataKey: v, index: i }));
}

function ReagentPricesLine({ dataKey, index }: Props & { dataKey: string; index: number }) {
  const { stroke, strokeWidth } = (() => {
    return {
      stroke: getColor(index),
      strokeWidth: 2,
    };
  })();

  const dot = true;

  const opacity = 1;

  return (
    <Area
      stackId={1}
      key={index}
      dataKey={(item: ILineItemOpen) => {
        // tslint:disable-next-line:no-console
        console.log("Area.dataKey()", dataKey, item, item.data[dataKey] ?? null);

        return item.data[dataKey] ?? null;
      }}
      animationDuration={500}
      animationEasing={"ease-in-out"}
      type={"monotone"}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill={stroke}
      dot={dot}
      opacity={opacity}
      connectNulls={true}
    />
  );
}

function CraftingCostLines(props: Props) {
  const {
    craftingCostOptions: { recipeItemIds },
  } = props;

  const dataKeys = [TotalReagentCostDataKey, ...recipeItemIds.map(resolveItemDataKey)];

  return dataKeys.map((v, i) => CraftingCostLine({ ...props, dataKey: v, index: i }));
}

function CraftingCostLine({
  craftingCostOptions: {
    recipeItemsSelected,
    totalReagentCostSelected,
    recipeItemIds,
    highlightedDataKey,
    onDataKeyHighlight,
  },
  dataKey,
  index,
}: Props & {
  dataKey: string;
  index: number;
}) {
  const hasSelections = recipeItemsSelected.size > 0 || totalReagentCostSelected;

  const isSelected = ((): boolean => {
    if (dataKey === TotalReagentCostDataKey) {
      return totalReagentCostSelected;
    }

    const recipeItemDataKeys = recipeItemIds.map(resolveItemDataKey);
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
      onMouseEnter={() => onDataKeyHighlight(dataKey)}
      onMouseLeave={() => onDataKeyHighlight(null)}
      connectNulls={true}
    />
  );
}

export function Lines(props: Props) {
  switch (props.currentTabKind) {
    case TabKind.craftingCost:
      return CraftingCostLines(props);
    case TabKind.reagentPrices:
      return ReagentPricesLines(props);
    default:
      return null;
  }
}
