import React from "react";

import { IFetchData } from "../../../types/global";
import { IRegionTokenHistories } from "../../../types/posts";

export interface IStateProps {
  regionTokenHistories: IFetchData<IRegionTokenHistories>;
}

type Props = Readonly<IStateProps>;

export class TokenHistoryGraph extends React.Component<Props> {
  public render() {
    return <p>Hello, world!</p>;
  }
}
