import React from "react";

import { LineChart, ResponsiveContainer } from "recharts";

import { IFetchData } from "../../../types/global";
import { FetchLevel } from "../../../types/main";
import { IRegionTokenHistories } from "../../../types/posts";
import { convertRegionTokenHistoriesToLineData } from "../../../util";

export interface IStateProps {
  regionTokenHistories: IFetchData<IRegionTokenHistories>;
}

type Props = Readonly<IStateProps>;

export class TokenHistoryGraph extends React.Component<Props> {
  public render() {
    const { regionTokenHistories } = this.props;

    switch (regionTokenHistories.level) {
      case FetchLevel.success:
        break;
      case FetchLevel.failure:
        return <p>Failed to fetch token-histories!</p>;
      case FetchLevel.fetching:
      default:
        return <p>Fetching regional token-histories...</p>;
    }

    const data = convertRegionTokenHistoriesToLineData(regionTokenHistories.data);

    return (
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} />
      </ResponsiveContainer>
    );
  }
}
