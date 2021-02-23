import React from "react";

import { Button, Classes, NonIdealState } from "@blueprintjs/core";
import { IItem, IPricelistJson, IRegionComposite } from "@sotah-inc/core";

import {
  PricelistTableContainer,
} from "../../../../containers/entry-point/PriceLists/PricelistTree/PricelistPanel/PricelistTable";
import { IClientRealm } from "../../../../types/global";

export interface IStateProps {
  currentRegion: IRegionComposite | null;
  currentRealm: IClientRealm | null;
  isAddEntryDialogOpen: boolean;
}

export interface IDispatchProps {
  changeIsAddEntryDialogOpen: (isDialogOpen: boolean) => void;
}

export interface IOwnProps {
  list: IPricelistJson;
}

export interface IFormValues {
  quantity: number;
  item: IItem | null;
}

export type Props = Readonly<IStateProps & IDispatchProps & IOwnProps>;

export class PricelistPanel extends React.Component<Props> {
  public render(): React.ReactNode {
    const { list, currentRegion, currentRealm, changeIsAddEntryDialogOpen } = this.props;

    if (currentRegion === null || currentRealm === null) {
      return null;
    }

    if (list.pricelist_entries.length === 0) {
      return (
        <NonIdealState
          title="No entries"
          description="You have no items to check."
          icon="list"
          action={
            <Button
              className={Classes.FILL}
              icon="plus"
              onClick={() => changeIsAddEntryDialogOpen(true)}
              text={`Add Entry to ${list.name}`}
            />
          }
        />
      );
    }

    return <PricelistTableContainer list={list} region={currentRegion} realm={currentRealm} />;
  }
}
