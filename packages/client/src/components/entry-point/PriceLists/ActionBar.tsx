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

import { ExpansionToggleContainer } from "../../../containers/util/ExpansionToggle";
import { RealmToggleContainer } from "../../../containers/util/RealmToggle";
import { RegionToggleContainer } from "../../../containers/util/RegionToggle";
import { IProfile } from "../../../types/global";
import { AuthLevel } from "../../../types/main";

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
  browseToExpansion: (region: IRegion, realm: IStatusRealm, expansion: IExpansion) => void;
  browseToProfession: (
    region: IRegion,
    realm: IStatusRealm,
    expansion: IExpansion,
    profession: IProfession,
  ) => void;
  browseToProfessionPricelist: (
    region: IRegion,
    realm: IStatusRealm,
    expansion: IExpansion,
    profession: IProfession,
    list: IPricelistJson,
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
            <ExpansionToggleContainer
              onExpansionChange={expansion => this.onExpansionChange(expansion)}
            />
            <RealmToggleContainer onRealmChange={(v: IStatusRealm) => this.onRealmChange(v)} />
            <RegionToggleContainer />
          </ButtonGroup>
        </NavbarGroup>
      </Navbar>
    );
  }

  private onExpansionChange(expansion: IExpansion) {
    const {
      browseToExpansion,
      browseToProfession,
      currentRegion,
      currentRealm,
      selectedProfession,
    } = this.props;

    if (currentRegion === null || currentRealm === null) {
      return;
    }

    if (selectedProfession === null) {
      browseToExpansion(currentRegion, currentRealm, expansion);

      return;
    }

    browseToProfession(currentRegion, currentRealm, expansion, selectedProfession);
  }

  private onRealmChange(realm: IStatusRealm) {
    const {
      browseToProfessionPricelist,
      browseToProfession,
      browseToExpansion,
      currentRegion,
      selectedProfession,
      selectedList,
      selectedExpansion,
    } = this.props;

    if (currentRegion === null || selectedExpansion === null) {
      return;
    }

    if (selectedProfession !== null && selectedList !== null) {
      browseToProfessionPricelist(
        currentRegion,
        realm,
        selectedExpansion,
        selectedProfession,
        selectedList,
      );

      return;
    }

    if (selectedProfession !== null && selectedList === null) {
      browseToProfession(currentRegion, realm, selectedExpansion, selectedProfession);

      return;
    }

    if (selectedProfession === null && selectedList === null) {
      browseToExpansion(currentRegion, realm, selectedExpansion);
    }
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
