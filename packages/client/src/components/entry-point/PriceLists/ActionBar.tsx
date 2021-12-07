import React from "react";

import {
  Alignment,
  Button,
  ButtonGroup,
  Classes,
  Intent,
  Navbar,
  NavbarGroup,
  Spinner,
} from "@blueprintjs/core";
import { Tooltip2 } from "@blueprintjs/popover2";
import {
  IExpansion,
  IPricelistJson,
  IConfigRegion,
  IShortProfession,
  UserLevel,
  GameVersion,
} from "@sotah-inc/core";

import { ExpansionToggleContainer } from "../../../containers/util/ExpansionToggle";
import { PricelistProfessionToggleContainer } from "../../../containers/util/PricelistProfessionToggle";
import { RealmToggleContainer } from "../../../containers/util/RealmToggle";
import { RegionToggleContainer } from "../../../containers/util/RegionToggle";
import { IClientRealm } from "../../../types/global";
import { AuthLevel, UserData } from "../../../types/main";

export interface IStateProps {
  currentGameVersion: GameVersion | null;
  currentRegion: IConfigRegion | null;
  currentRealm: IClientRealm | null;
  isAddListDialogOpen: boolean;
  isAddEntryDialogOpen: boolean;
  selectedList: IPricelistJson | null;
  selectedProfession: IShortProfession | null;
  userData: UserData;
  selectedExpansion: IExpansion | null;
}

export interface IDispatchProps {
  changeIsAddListDialogOpen: (isDialogOpen: boolean) => void;
  changeIsAddEntryDialogOpen: (isDialogOpen: boolean) => void;
  changeIsEditListDialogOpen: (isDialogOpen: boolean) => void;
  changeIsDeleteListDialogOpen: (isDialogOpen: boolean) => void;
}

export interface IRouteProps {
  browseToExpansion: (
    gameVersion: GameVersion,
    region: IConfigRegion,
    realm: IClientRealm,
    expansion: IExpansion,
  ) => void;
  browseToProfession: (
    gameVersion: GameVersion,
    region: IConfigRegion,
    realm: IClientRealm,
    expansion: IExpansion,
    profession: IShortProfession,
  ) => void;
  browseToProfessionPricelist: (
    gameVersion: GameVersion,
    region: IConfigRegion,
    realm: IClientRealm,
    expansion: IExpansion,
    profession: IShortProfession,
    list: IPricelistJson,
  ) => void;
}

export type IOwnProps = IRouteProps;

export type Props = Readonly<IStateProps & IDispatchProps & IOwnProps>;

export class ActionBar extends React.Component<Props> {
  public render(): React.ReactNode {
    return (
      <Navbar className="pricelist-actionbar">
        <NavbarGroup align={Alignment.LEFT}>{this.renderButtons()}</NavbarGroup>
        <NavbarGroup align={Alignment.RIGHT}>
          <ButtonGroup>
            <PricelistProfessionToggleContainer
              onProfessionChange={profession => this.onProfessionChange(profession)}
            />
            <ExpansionToggleContainer
              onExpansionChange={expansion => this.onExpansionChange(expansion)}
            />
            <RealmToggleContainer onRealmChange={(v: IClientRealm) => this.onRealmChange(v)} />
            <RegionToggleContainer />
          </ButtonGroup>
        </NavbarGroup>
      </Navbar>
    );
  }

  private onProfessionChange(profession: IShortProfession) {
    const {
      browseToProfession,
      currentGameVersion,
      currentRegion,
      currentRealm,
      selectedExpansion,
    } = this.props;

    if (
      currentGameVersion === null ||
      currentRegion === null ||
      currentRealm === null ||
      selectedExpansion === null
    ) {
      return;
    }

    browseToProfession(
      currentGameVersion,
      currentRegion,
      currentRealm,
      selectedExpansion,
      profession,
    );
  }

  private onExpansionChange(expansion: IExpansion) {
    const {
      browseToExpansion,
      currentGameVersion,
      browseToProfession,
      currentRegion,
      currentRealm,
      selectedProfession,
    } = this.props;

    if (currentGameVersion === null || currentRegion === null || currentRealm === null) {
      return;
    }

    if (selectedProfession === null) {
      browseToExpansion(currentGameVersion, currentRegion, currentRealm, expansion);

      return;
    }

    browseToProfession(
      currentGameVersion,
      currentRegion,
      currentRealm,
      expansion,
      selectedProfession,
    );
  }

  private onRealmChange(realm: IClientRealm) {
    const {
      browseToProfessionPricelist,
      browseToProfession,
      browseToExpansion,
      currentGameVersion,
      currentRegion,
      selectedProfession,
      selectedList,
      selectedExpansion,
    } = this.props;

    if (currentGameVersion === null || currentRegion === null || selectedExpansion === null) {
      return;
    }

    if (selectedProfession !== null && selectedList !== null) {
      browseToProfessionPricelist(
        currentGameVersion,
        currentRegion,
        realm,
        selectedExpansion,
        selectedProfession,
        selectedList,
      );

      return;
    }

    if (selectedProfession !== null && selectedList === null) {
      browseToProfession(
        currentGameVersion,
        currentRegion,
        realm,
        selectedExpansion,
        selectedProfession,
      );

      return;
    }

    if (selectedProfession === null && selectedList === null) {
      browseToExpansion(currentGameVersion, currentRegion, realm, selectedExpansion);
    }
  }

  private renderListButtons() {
    const {
      selectedList,
      changeIsAddEntryDialogOpen,
      changeIsDeleteListDialogOpen,
      changeIsEditListDialogOpen,
      selectedProfession,
      userData,
    } = this.props;

    const canMutateEntry = ((): boolean => {
      if (selectedProfession === null) {
        return false;
      }

      if (selectedList === null) {
        return false;
      }

      if (userData.authLevel !== AuthLevel.authenticated) {
        return false;
      }

      return userData.profile.user.level === UserLevel.Admin;
    })();

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
            disabled={!canMutateEntry}
          />
        </ButtonGroup>
      </>
    );
  }

  private renderAddListButton() {
    const { changeIsAddListDialogOpen, selectedProfession, userData } = this.props;

    let createListText = "List";
    if (selectedProfession !== null) {
      createListText = `${selectedProfession.name} List`;
    }

    if (userData.authLevel !== AuthLevel.authenticated) {
      return <Button icon="plus" text={createListText} disabled={true} />;
    }

    if (userData.profile.user.level !== UserLevel.Admin) {
      return (
        <Tooltip2
          content="You are not authorized to manage profession pricelists!"
          placement={"right"}
        >
          <Button icon="plus" text={createListText} disabled={true} />
        </Tooltip2>
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
