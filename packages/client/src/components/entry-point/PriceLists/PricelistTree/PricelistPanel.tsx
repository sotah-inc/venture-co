import React from "react";

import { Button, Classes, NonIdealState } from "@blueprintjs/core";
import { IItem, IPricelistJson, IRegionComposite, IStatusRealm } from "@sotah-inc/core";

// tslint:disable-next-line:max-line-length
import { PricelistTableContainer } from "../../../../containers/entry-point/PriceLists/PricelistTree/PricelistPanel/PricelistTable";

export interface IStateProps {
  currentRegion: IRegionComposite | null;
  currentRealm: IStatusRealm | null;
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
  public render() {
    const { list, currentRegion, currentRealm, changeIsAddEntryDialogOpen } = this.props;

    if (list.pricelist_entries!.length === 0) {
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

    return <PricelistTableContainer list={list} region={currentRegion!} realm={currentRealm!} />;
  }
}
