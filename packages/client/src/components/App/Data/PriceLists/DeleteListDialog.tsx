import * as React from "react";

import { Button, Callout, Dialog, Intent } from "@blueprintjs/core";

import { IPricelistJson } from "../../../../api-types/entities";
import { IExpansion } from "../../../../api-types/expansion";
import { IProfession } from "../../../../api-types/profession";
import { IRealm, IRegion } from "../../../../api-types/region";
import { IProfile } from "../../../../types/global";
import { FetchLevel } from "../../../../types/main";
import { GetAppToaster } from "../../../../util/toasters";
import { DialogActions, DialogBody } from "../../../util";

export interface IStateProps {
  selectedList: IPricelistJson | null;
  profile: IProfile | null;
  isDeleteListDialogOpen: boolean;
  deletePricelistLevel: FetchLevel;
  selectedProfession: IProfession | null;
  selectedExpansion: IExpansion | null;
  currentRealm: IRealm | null;
  currentRegion: IRegion | null;
}

export interface IDispatchProps {
  changeIsDeleteListDialogOpen: (isDialogOpen: boolean) => void;
  deletePricelist: (token: string, id: number) => void;
  deleteProfessionPricelist: (token: string, id: number) => void;
}

export interface IRouteProps {
  browseOnDeletion: (
    region: IRegion,
    realm: IRealm,
    profession: IProfession,
    expansion: IExpansion,
    pricelist: IPricelistJson | null,
  ) => void;
}

export type IOwnProps = IRouteProps;

export type Props = Readonly<IStateProps & IDispatchProps & IOwnProps>;

export class DeleteListDialog extends React.Component<Props> {
  public componentDidUpdate(prevProps: Props) {
    const {
      deletePricelistLevel,
      currentRegion,
      currentRealm,
      selectedProfession,
      selectedExpansion,
      selectedList,
      browseOnDeletion,
    } = this.props;

    if (
      currentRegion === null ||
      currentRealm === null ||
      selectedProfession === null ||
      selectedExpansion === null
    ) {
      return;
    }

    if (prevProps.deletePricelistLevel !== deletePricelistLevel) {
      switch (deletePricelistLevel) {
        case FetchLevel.success:
          const AppToaster = GetAppToaster();
          if (AppToaster !== null) {
            AppToaster.show({
              icon: "info-sign",
              intent: Intent.SUCCESS,
              message: "Your pricelist has been deleted.",
            });
          }

          browseOnDeletion(
            currentRegion,
            currentRealm,
            selectedProfession,
            selectedExpansion,
            selectedList,
          );

          return;
        default:
          return;
      }
    }
  }

  public render() {
    const {
      isDeleteListDialogOpen,
      selectedList,
      changeIsDeleteListDialogOpen,
      deletePricelistLevel,
    } = this.props;

    if (selectedList === null) {
      return null;
    }

    return (
      <Dialog
        isOpen={isDeleteListDialogOpen}
        onClose={() => changeIsDeleteListDialogOpen(isDeleteListDialogOpen)}
        title="Delete List"
        icon="delete"
      >
        <DialogBody>
          <Callout intent={Intent.DANGER} icon="info-sign">
            Are you sure you want to delete "{selectedList.name}"
          </Callout>
        </DialogBody>
        <DialogActions>
          <Button text="Cancel" intent={Intent.NONE} onClick={() => this.onDialogCancel()} />
          <Button
            type="submit"
            intent={Intent.DANGER}
            icon="delete"
            text={`Delete "${selectedList.name}"`}
            onClick={() => this.onDialogConfirm()}
            disabled={deletePricelistLevel === FetchLevel.fetching}
          />
        </DialogActions>
      </Dialog>
    );
  }

  private onDialogCancel() {
    const { changeIsDeleteListDialogOpen } = this.props;

    changeIsDeleteListDialogOpen(false);
  }

  private onDialogConfirm() {
    const {
      selectedList,
      deletePricelist,
      profile,
      selectedProfession,
      deleteProfessionPricelist,
    } = this.props;

    if (profile === null || selectedList === null) {
      return;
    }

    if (selectedProfession === null) {
      deletePricelist(profile.token, selectedList.id);

      return;
    }

    deleteProfessionPricelist(profile.token, selectedList.id);
  }
}
