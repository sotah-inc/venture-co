import React from "react";

import { Classes, Intent, NonIdealState, Spinner } from "@blueprintjs/core";
import { IPricelistJson, IRealm, IRegion } from "@sotah-inc/core";

// tslint:disable-next-line:max-line-length
import { PricelistPanelContainer } from "../../../../../containers/App/Data/PriceLists/PricelistTree/PricelistPanel";
// tslint:disable-next-line:max-line-length
import { RealmSummaryPanelContainer } from "../../../../../containers/App/Data/PriceLists/PricelistTree/TreeContent/RealmSummaryPanel";
import { LastModified } from "../../../../util";

export interface IStateProps {
  currentRegion: IRegion | null;
  currentRealm: IRealm | null;
  selectedList: IPricelistJson | null;
}

export type Props = Readonly<IStateProps>;

export class TreeContent extends React.Component<Props> {
  public render() {
    const { selectedList, currentRealm, currentRegion } = this.props;

    if (currentRealm === null || currentRegion === null) {
      return (
        <NonIdealState
          title="Loading"
          icon={<Spinner className={Classes.LARGE} intent={Intent.NONE} value={0} />}
        />
      );
    }

    if (selectedList === null) {
      return <RealmSummaryPanelContainer realm={currentRealm} region={currentRegion} />;
    }

    return (
      <>
        <PricelistPanelContainer list={selectedList} />
        {this.renderLastModified()}
      </>
    );
  }

  private renderLastModified() {
    const { currentRealm } = this.props;

    if (currentRealm === null) {
      return;
    }

    return (
      <LastModified
        targetDate={new Date(currentRealm.realm_modification_dates.downloaded * 1000)}
      />
    );
  }
}
