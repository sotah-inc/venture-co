import React from "react";

import { IPriceLimits, ItemId } from "@sotah-inc/core";
import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts";

import { ILineItemOpen } from "../../../../../../types/global";
import {
  currencyToText,
  getColor,
  getXAxisTimeRestrictions,
  unixTimestampToText,
} from "../../../../../../util";
import { resolveItemDataKey } from "./common";

export interface IOwnProps {
  data: ILineItemOpen[];
  aggregatePriceLimits: IPriceLimits;

  reagentItemIds: ItemId[];
  recipeItemIds: ItemId[];
}

export type Props = Readonly<IOwnProps>;

function RecipeItemPricesLines(props: Props) {
  return props.recipeItemIds.map((v, i) =>
    RecipeItemPricesLine({ ...props, dataKey: resolveItemDataKey(v), index: i }),
  );
}

function RecipeItemPricesLine({
  dataKey,
  index,
}: Props & {
  dataKey: string;
  index: number;
}) {
  return (
    <Line
      key={index}
      dataKey={(item: ILineItemOpen) => item.data[dataKey] ?? null}
      animationDuration={500}
      animationEasing={"ease-in-out"}
      fill={getColor(index)}
    />
  );
}

function ReagentItemPricesBars(props: Props) {
  return props.reagentItemIds.map((v, i) =>
    ReagentItemPricesBar({
      ...props,
      dataKey: `${v}_buyout`,
      index: i + props.recipeItemIds.length,
    }),
  );
}

function ReagentItemPricesBar({
  dataKey,
  index,
}: Props & {
  dataKey: string;
  index: number;
}) {
  return (
    <Bar
      stackId={1}
      key={index}
      dataKey={(item: ILineItemOpen) => item.data[dataKey] ?? null}
      animationDuration={500}
      animationEasing={"ease-in-out"}
      fill={getColor(index)}
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
        domain={[0, props.aggregatePriceLimits.upper / 10 / 10]}
        tick={{ fill: "#fff" }}
      />
      {[...RecipeItemPricesLines(props), ...ReagentItemPricesBars(props)]}
    </ComposedChart>
  );
}
