import React from "react";

import { Callout, Card, Classes, H5, Intent, NonIdealState, Spinner } from "@blueprintjs/core";
import { IConfigRegion } from "@sotah-inc/core";

import {
  UnmetDemandRouteContainer,
  // eslint-disable-next-line max-len
} from "../../../../../route-containers/entry-point/PriceLists/PricelistTree/TreeContent/RealmSummaryPanel/UnmetDemand";
import { IClientRealm } from "../../../../../types/global";

export interface IStateProps {
  currentRegion: IConfigRegion | null;
  currentRealm: IClientRealm | null;
}

export type Props = Readonly<IStateProps>;

export class RealmSummaryPanel extends React.Component<Props> {
  public render(): React.ReactNode {
    const { currentRegion, currentRealm } = this.props;

    if (currentRegion === null || currentRealm === null) {
      return (
        <>
          <Callout style={{ marginBottom: "10px" }}>
            <H5>Summary</H5>
            <NonIdealState
              title="Loading"
              icon={<Spinner className={Classes.LARGE} intent={Intent.NONE} value={0} />}
            />
          </Callout>
          <Card>{<UnmetDemandRouteContainer />}</Card>
        </>
      );
    }

    const realmString = `${currentRegion.name.toUpperCase()}-${
      currentRealm.realm.name.en_US
    }`;
    const population = <em>{currentRealm.population.name.en_US} population</em>;

    return (
      <>
        <Callout style={{ marginBottom: "10px" }}>
          <H5>Summary</H5>
          <p style={{ marginBottom: 0 }}>
            {realmString} is a {population} realm
          </p>
        </Callout>
        <Card>{<UnmetDemandRouteContainer />}</Card>
      </>
    );
  }
}
