import React from "react";

import { Callout, Card, Classes, H5, Intent, NonIdealState, Spinner } from "@blueprintjs/core";
import { IRegionComposite } from "@sotah-inc/core";

import { UnmetDemandRouteContainer } from "../../../../../route-containers/entry-point/PriceLists/PricelistTree/TreeContent/RealmSummaryPanel/UnmetDemand";
import { IClientRealm } from "../../../../../types/global";

export interface IStateProps {
  currentRegion: IRegionComposite | null;
  currentRealm: IClientRealm | null;
}

export type Props = Readonly<IStateProps>;

export class RealmSummaryPanel extends React.Component<Props> {
  public render() {
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

    return (
      <>
        <Callout style={{ marginBottom: "10px" }}>
          <H5>Summary</H5>
          <p style={{ marginBottom: 0 }}>
            {currentRegion.config_region.name.toUpperCase()}-{currentRealm.realm.name.en_US} is a{" "}
            <em>{currentRealm.population.name.en_US} population</em> realm
          </p>
        </Callout>
        <Card>{<UnmetDemandRouteContainer />}</Card>
      </>
    );
  }
}
