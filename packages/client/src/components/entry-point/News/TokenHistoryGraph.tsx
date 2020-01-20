import React from "react";

import { LineChart, ResponsiveContainer } from "recharts";

import { IFetchData, ILineItemOpen } from "../../../types/global";
import { FetchLevel } from "../../../types/main";
import { IRegionTokenHistories } from "../../../types/posts";

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

    const data = Object.keys(regionTokenHistories).reduce<ILineItemOpen[]>(
      (prevData, regionName) => {
        const tokenHistory = regionTokenHistories.data[regionName];
        if (typeof tokenHistory === "undefined") {
          return prevData;
        }

        return Object.keys(tokenHistory).reduce<ILineItemOpen[]>((finalResult, unixTimestamp) => {
          return [
            ...finalResult,
            {
              data: {
                [`${regionName}_token_price`]: tokenHistory[Number(unixTimestamp)],
              },
              name: Number(unixTimestamp),
            },
          ];
        }, prevData);
      },
      [],
    );

    return (
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} />
      </ResponsiveContainer>
    );
  }
}
