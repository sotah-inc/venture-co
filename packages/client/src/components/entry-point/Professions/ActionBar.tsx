import React from "react";

import { Alignment, ButtonGroup, Navbar, NavbarGroup } from "@blueprintjs/core";
import { IRegionComposite } from "@sotah-inc/core";

import { RealmToggleContainer } from "../../../containers/util/RealmToggle";
import { RegionToggleContainer } from "../../../containers/util/RegionToggle";
import { IClientRealm } from "../../../types/global";

export interface IStateProps {
  currentRegion: IRegionComposite | null;
  currentRealm: IClientRealm | null;
}

export type Props = Readonly<IStateProps>;

export class ActionBar extends React.Component<Props> {
  public render() {
    return (
      <Navbar className="professions-actionbar">
        <NavbarGroup align={Alignment.RIGHT}>
          <ButtonGroup>
            <RealmToggleContainer onRealmChange={(v: IClientRealm) => this.onRealmChange(v)} />
            <RegionToggleContainer />
          </ButtonGroup>
        </NavbarGroup>
      </Navbar>
    );
  }

  private onRealmChange(realm: IClientRealm) {
    const { currentRegion } = this.props;

    if (currentRegion === null) {
      return;
    }

    // tslint:disable-next-line:no-console
    console.log("realm", realm);
  }
}
