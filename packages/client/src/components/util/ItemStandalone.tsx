import React from "react";

import { IItem, ItemId } from "@sotah-inc/core";
import { IFetchData } from "../../types/global";

export interface IOwnProps {
  itemId: ItemId;
}

interface IState {
  item: IFetchData<IItem>;
}

export class ItemStandalone extends React.Component<IOwnProps, IState> {
  public render() {
    return <p>Hello, world!</p>;
  }
}
