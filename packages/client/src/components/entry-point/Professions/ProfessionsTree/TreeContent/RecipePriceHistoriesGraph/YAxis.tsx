import React from "react";

import { YAxis as RechartsYAxis } from "recharts";

import { currencyToText } from "../../../../../../util";
import { ICraftingCostYAxisOptions, IReagentPricesYAxisOptions, TabKind } from "./common";

// props
export interface IOwnProps {
  currentTabKind: TabKind;

  craftingCostOptions: ICraftingCostYAxisOptions;
  reagentPricesOptions: IReagentPricesYAxisOptions;
}

export type Props = Readonly<IOwnProps>;

export function YAxis({ currentTabKind, craftingCostOptions, reagentPricesOptions }: Props) {
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
      return (
        <RechartsYAxis
          tickFormatter={v => currencyToText(v * 10 * 10)}
          domain={[
            reagentPricesOptions.aggregatePriceLimits.lower / 10 / 10,
            reagentPricesOptions.aggregatePriceLimits.upper / 10 / 10,
          ]}
          tick={{ fill: "#fff" }}
          scale="log"
          allowDataOverflow={true}
          mirror={true}
        />
      );
    default:
      return null;
  }
}
