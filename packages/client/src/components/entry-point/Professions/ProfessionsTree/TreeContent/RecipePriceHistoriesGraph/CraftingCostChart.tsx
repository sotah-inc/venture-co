import React from "react";

import { IPriceLimits, ItemId } from "@sotah-inc/core";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { ILineItemOpen } from "../../../../../../types/global";
import {
  currencyToText,
  getColor,
  getXAxisTimeRestrictions,
  maxDataDomain,
  minDataDomain,
  unixTimestampToText,
} from "../../../../../../util";
import { resolveItemDataKey, TotalReagentCostDataKey } from "./common";

export interface IOwnProps {
  data: ILineItemOpen[];
  overallPriceLimits: IPriceLimits;
  recipeItemIds: ItemId[];
  totalReagentCostSelected: boolean;
  highlightedDataKey: string | null;
  recipeItemsSelected: Set<ItemId>;

  onDataKeyHighlight: (dataKey: string | null) => void;
}

export type Props = Readonly<IOwnProps>;

function CraftingCostLines(props: Props) {
  const { recipeItemIds } = props;

  const dataKeys = [TotalReagentCostDataKey, ...recipeItemIds.map(resolveItemDataKey)];

  return dataKeys.map((v, i) => CraftingCostLine({ ...props, dataKey: v, index: i }));
}

function CraftingCostLine({
  recipeItemIds,
  highlightedDataKey,
  totalReagentCostSelected,
  recipeItemsSelected,
  onDataKeyHighlight,
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

export function CraftingCostChart(props: Props) {
  const { xAxisTicks, roundedNowDate, roundedTwoWeeksAgoDate } = getXAxisTimeRestrictions();

  return (
    <LineChart data={props.data}>
      <CartesianGrid vertical={false} strokeWidth={0.25} strokeOpacity={0.25} />
      <XAxis
        dataKey="name"
        tickFormatter={unixTimestampToText}
        domain={[roundedTwoWeeksAgoDate.unix(), roundedNowDate.unix()]}
        type="number"
        ticks={xAxisTicks}
        tick={{ fill: "#fff" }}
      />
      <YAxis
        tickFormatter={v => currencyToText(v * 10 * 10)}
        domain={[minDataDomain, maxDataDomain]}
        tick={{ fill: "#fff" }}
        scale="log"
        allowDataOverflow={true}
        mirror={true}
      />
      {CraftingCostLines(props)}
    </LineChart>
  );
}
