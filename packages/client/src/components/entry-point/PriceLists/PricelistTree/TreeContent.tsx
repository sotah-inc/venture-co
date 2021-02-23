import React from "react";

import { Classes, Intent, NonIdealState, Spinner } from "@blueprintjs/core";
import { IPricelistJson, IRegionComposite } from "@sotah-inc/core";

import {
  PricelistPanelContainer,
} from "../../../../containers/entry-point/PriceLists/PricelistTree/PricelistPanel";
import {
  RealmSummaryPanelContainer,
} from "../../../../containers/entry-point/PriceLists/PricelistTree/TreeContent/RealmSummaryPanel";
import { IClientRealm } from "../../../../types/global";
import { LastModified } from "../../../util";

export interface IStateProps {
  currentRegion: IRegionComposite | null;
  currentRealm: IClientRealm | null;
  selectedList: IPricelistJson | null;
}

export type Props = Readonly<IStateProps>;

export class TreeContent extends React.Component<Props> {
  public render(): React.ReactNode {
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
      return <RealmSummaryPanelContainer />;
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
      <LastModified targetDate={new Date(currentRealm.realmModificationDates.downloaded * 1000)} />
    );
  }
}
