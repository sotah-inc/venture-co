import React from "react";

import { YAxis as RechartsYAxis } from "recharts";

import { currencyToText } from "../../../../../../util";
import { ICraftingCostYAxisOptions, TabKind } from "./common";

// props
export interface IOwnProps {
  currentTabKind: TabKind;

  craftingCostOptions: ICraftingCostYAxisOptions;
}

export type Props = Readonly<IOwnProps>;

export function YAxis({ currentTabKind, craftingCostOptions }: Props) {
  switch (currentTabKind) {
    case TabKind.craftingCost:
      return (
        <RechartsYAxis
          tickFormatter={v => currencyToText(v * 10 * 10)}
          domain={[
            craftingCostOptions.overallPriceLimits.lower / 10 / 10,
            craftingCostOptions.overallPriceLimits.upper / 10 / 10,
          ]}
          tick={{ fill: "#fff" }}
          scale="log"
          allowDataOverflow={true}
          mirror={true}
        />
      );
    case TabKind.reagentPrices:
    default:
      return null;
  }
}
