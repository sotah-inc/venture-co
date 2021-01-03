import React from "react";

import { ComposedChart as RechartsComposedChart } from "recharts";

import { ILineItemOpen } from "../../../../../../types/global";
import { TabKind } from "./common";

export interface IOwnProps {
  currentTabKind: TabKind;
  craftingCostData: ILineItemOpen[];
  reagentPricesData: ILineItemOpen[];
  children: React.ReactNode;
}

export type Props = Readonly<IOwnProps>;

export function ComposedChart({
  currentTabKind,
  craftingCostData,
  reagentPricesData,
  children,
}: Props) {
  switch (currentTabKind) {
    case TabKind.craftingCost:
      return <RechartsComposedChart data={craftingCostData}>{children}</RechartsComposedChart>;
    case TabKind.reagentPrices:
      return <RechartsComposedChart data={reagentPricesData}>{children}</RechartsComposedChart>;
    default:
      return null;
  }
}
