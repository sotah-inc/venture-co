import React from "react";

import { IPriceLimits, ItemId } from "@sotah-inc/core";
import { Area, CartesianGrid, LineChart, XAxis, YAxis } from "recharts";

import { ILineItemOpen } from "../../../../../../types/global";
import {
  currencyToText,
  getColor,
  getXAxisTimeRestrictions,
  unixTimestampToText,
} from "../../../../../../util";
import { resolveItemDataKey, TotalReagentCostDataKey } from "./common";

export interface IOwnProps {
  data: ILineItemOpen[];
  aggregatePriceLimits: IPriceLimits;

  reagentItemIds: ItemId[];
}

export type Props = Readonly<IOwnProps>;

function ReagentPricesLines(props: Props) {
  const { reagentItemIds } = props;

  const dataKeys = [TotalReagentCostDataKey, ...reagentItemIds.map(resolveItemDataKey)];

  return dataKeys.map((v, i) => ReagentPricesLine({ ...props, dataKey: v, index: i }));
}

function ReagentPricesLine({
  dataKey,
  index,
}: Props & {
  dataKey: string;
  index: number;
}) {
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

export function ReagentPricesChart(props: Props) {
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
        domain={[
          props.aggregatePriceLimits.lower / 10 / 10,
          props.aggregatePriceLimits.upper / 10 / 10,
        ]}
        tick={{ fill: "#fff" }}
        scale="log"
        allowDataOverflow={true}
        mirror={true}
      />
      {ReagentPricesLines(props)}
    </LineChart>
  );
}
