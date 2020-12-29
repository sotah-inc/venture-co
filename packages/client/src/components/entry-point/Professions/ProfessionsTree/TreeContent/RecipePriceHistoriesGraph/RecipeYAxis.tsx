import React from "react";

import { IPriceLimits } from "@sotah-inc/core";
import { YAxis } from "recharts";

import { currencyToText } from "../../../../../../util";
import { TabKind } from "./common";

// props
export interface IOwnProps {
  currentTabKind: TabKind;
  overallPriceLimits: IPriceLimits;
}

export type Props = Readonly<IOwnProps>;

export class RecipeYAxis extends React.Component<Props> {
  public render() {
    const { currentTabKind, overallPriceLimits } = this.props;

    switch (currentTabKind) {
      case TabKind.craftingCost:
        return (
          <YAxis
            tickFormatter={v => currencyToText(v * 10 * 10)}
            domain={[overallPriceLimits.lower / 10 / 10, overallPriceLimits.upper / 10 / 10]}
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
}
