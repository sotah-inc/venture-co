import React from "react";

import {
  Alignment,
  Button,
  ButtonGroup,
  Classes,
  Intent,
  Navbar,
  NavbarGroup,
  Position,
  Spinner,
  Tooltip,
} from "@blueprintjs/core";
import {
  IExpansion,
  IPricelistJson,
  IProfession,
  IRegion,
  IStatusRealm,
  UserLevel,
} from "@sotah-inc/core";

import { RealmToggleContainer } from "../../../../containers/util/RealmToggle";
import { RegionToggleContainer } from "../../../../containers/util/RegionToggle";
import { IProfile } from "../../../../types/global";
import { AuthLevel } from "../../../../types/main";

export interface IStateProps {
  currentRegion: IRegion | null;
  currentRealm: IStatusRealm | null;
  isAddListDialogOpen: boolean;
  isAddEntryDialogOpen: boolean;
  selectedList: IPricelistJson | null;
  selectedProfession: IProfession | null;
  authLevel: AuthLevel;
  profile: IProfile | null;
  selectedExpansion: IExpansion | null;
}

export interface IDispatchProps {
  changeIsAddListDialogOpen: (isDialogOpen: boolean) => void;
  changeIsAddEntryDialogOpen: (isDialogOpen: boolean) => void;
  changeIsEditListDialogOpen: (isDialogOpen: boolean) => void;
  changeIsDeleteListDialogOpen: (isDialogOpen: boolean) => void;
}

export interface IRouteProps {
  browseOnRealmChange: (
    region: IRegion,
    realm: IStatusRealm,
    profession: IProfession | null,
    expansion: IExpansion | null,
    list: IPricelistJson | null,
  ) => void;
}

export type IOwnProps = IRouteProps;

export type Props = Readonly<IStateProps & IDispatchProps & IOwnProps>;

export class ActionBar extends React.Component<Props> {
  public render() {
    return (
      <Navbar>
        <NavbarGroup align={Alignment.LEFT}>{this.renderButtons()}</NavbarGroup>
        <NavbarGroup align={Alignment.RIGHT}>
          <ButtonGroup>
            <RealmToggleContainer onRealmChange={(v: IStatusRealm) => this.onRealmChange(v)} />
            <RegionToggleContainer />
          </ButtonGroup>
        </NavbarGroup>
      </Navbar>
    );
  }

  private onRealmChange(realm: IStatusRealm) {
    const {
      browseOnRealmChange,
      currentRegion,
      selectedProfession,
      selectedList,
      selectedExpansion,
    } = this.props;

    if (currentRegion === null) {
      return;
    }

    browseOnRealmChange(currentRegion, realm, selectedProfession, selectedExpansion, selectedList);
  }

  private renderListButtons() {
    const {
      authLevel,
      selectedList,
      changeIsAddEntryDialogOpen,
      changeIsDeleteListDialogOpen,
      changeIsEditListDialogOpen,
      selectedProfession,
      profile,
    } = this.props;

    let canMutateEntry = authLevel === AuthLevel.authenticated && selectedList !== null;
    if (selectedProfession !== null && profile !== null && profile.user.level !== UserLevel.Admin) {
      canMutateEntry = false;
    }

    return (
      <>
        <Navbar.Divider />
        <Button
          icon="plus"
          onClick={() => changeIsAddEntryDialogOpen(true)}
          text="Entry"
          disabled={!canMutateEntry}
        />
        <Navbar.Divider />
        <ButtonGroup>
          <Button
            icon="edit"
            onClick={() => changeIsEditListDialogOpen(true)}
            disabled={!canMutateEntry}
          />
          <Button
            icon="delete"
            onClick={() => changeIsDeleteListDialogOpen(true)}
            text="Delete"
            disabled={!canMutateEntry}
          />
        </ButtonGroup>
      </>
    );
  }

  private renderAddListButton() {
    const { changeIsAddListDialogOpen, selectedProfession, authLevel, profile } = this.props;

    let createListText = "List";
    if (selectedProfession !== null) {
      createListText = `${selectedProfession.label} List`;
    }

    if (authLevel === AuthLevel.unauthenticated || profile === null) {
      return <Button icon="plus" text={createListText} disabled={true} />;
    }

    if (selectedProfession !== null && profile.user.level !== UserLevel.Admin) {
      return (
        <Tooltip
          content="You are not authorized to manage profession pricelists!"
          position={Position.RIGHT}
        >
          <Button icon="plus" text={createListText} disabled={true} />
        </Tooltip>
      );
    }

    return (
      <Button icon="plus" onClick={() => changeIsAddListDialogOpen(true)} text={createListText} />
    );
  }

  private renderButtons() {
    const { currentRegion, currentRealm } = this.props;

    if (currentRegion === null || currentRealm === null) {
      return <Spinner className={Classes.SMALL} intent={Intent.NONE} value={0} />;
    }

    return (
      <>
        {this.renderAddListButton()}
        {this.renderListButtons()}
      </>
    );
  }
}
