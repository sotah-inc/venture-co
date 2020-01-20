import React from "react";

import { currencyToText } from "../../util";

interface IProps {
  amount: number;
  hideCopper?: boolean;
}

export function Currency(props: IProps) {
  const { hideCopper, amount } = props;

  return <>{currencyToText(amount, hideCopper)}</>;
}
