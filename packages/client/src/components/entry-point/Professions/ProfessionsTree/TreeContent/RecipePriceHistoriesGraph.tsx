import React from "react";

import { IRecipePriceHistories } from "@sotah-inc/core";

import { IFetchData } from "../../../../../types/global";

// props
export interface IStateProps {
  recipePriceHistories: IFetchData<IRecipePriceHistories>;
}

export type Props = Readonly<IStateProps>;

export class RecipePriceHistoriesGraph extends React.Component<Props> {
  public render() {
    return <p>Hello, world!</p>;
  }
}
