import React from "react";

import { IPriceLimits, IShortRecipe, ItemId } from "@sotah-inc/core";
import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts";

import { IItemsData, ILineItemOpen } from "../../../../../../types/global";
import {
  currencyToText,
  getColor,
  getXAxisTimeRestrictions,
  unixTimestampToText,
  zeroGraphValue,
} from "../../../../../../util";
import { resolveItemDataKey } from "./common";

export interface IOwnProps {
  data: ILineItemOpen[];
  aggregatePriceLimits: IPriceLimits;
  reagentItemIds: ItemId[];
  recipeItemIds: ItemId[];
  selectedRecipe: IItemsData<IShortRecipe>;
  highlightedDataKey: string | null;
}

export type Props = Readonly<IOwnProps>;

function RecipeItemPricesLines(props: Props) {
  return props.recipeItemIds.map((v, i) =>
    RecipeItemPricesLine({
      ...props,
      dataKey: resolveItemDataKey(v),
      index: i + props.reagentItemIds.length,
    }),
  );
}

function RecipeItemPricesLine({
  dataKey,
  index,
  highlightedDataKey,
}: Props & {
  dataKey: string;
  index: number;
}) {
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

  return (
    <Line
      key={index}
      dataKey={(item: ILineItemOpen) => item.data[dataKey] ?? null}
      animationDuration={500}
      animationEasing={"ease-in-out"}
      type={"monotone"}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  );
}

function ReagentItemPricesBars(props: Props) {
  return props.reagentItemIds.map((v, i) =>
    ReagentItemPricesBar({
      ...props,
      dataKey: resolveItemDataKey(v),
      index: i,
    }),
  );
}

function ReagentItemPricesBar({
  dataKey,
  index,
  selectedRecipe,
  highlightedDataKey,
}: Props & {
  dataKey: string;
  index: number;
}) {
  const fill =
    highlightedDataKey === null || highlightedDataKey === dataKey ? getColor(index) : "#5C7080";

  return (
    <Bar
      stackId={1}
      key={index}
      dataKey={(item: ILineItemOpen) => {
        const dataPoint = item.data[dataKey];
        if (dataPoint === null || typeof dataPoint === "undefined") {
          return null;
        }

        const foundReagent = selectedRecipe.data.reagents.find(
          v => resolveItemDataKey(v.reagent.id) === dataKey,
        );
        if (typeof foundReagent === "undefined") {
          return null;
        }

        return dataPoint * foundReagent.quantity;
      }}
      animationDuration={500}
      animationEasing={"ease-in-out"}
      fill={fill}
    />
  );
}

export function ReagentPricesChart(props: Props) {
  const { xAxisTicks, roundedNowDate, roundedTwoWeeksAgoDate } = getXAxisTimeRestrictions();

  return (
    <ComposedChart data={props.data}>
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
        domain={[
          0,
          dataMax => {
            if (dataMax <= 1) {
              return 10;
            }

            const result = Math.pow(10, Math.floor(Math.log10(dataMax)));
            if (result === 0) {
              return zeroGraphValue;
            }

            return dataMax - (dataMax % result) + result;
          },
        ]}
        tick={{ fill: "#fff" }}
      />
      {[...ReagentItemPricesBars(props), ...RecipeItemPricesLines(props)]}
    </ComposedChart>
  );
}
