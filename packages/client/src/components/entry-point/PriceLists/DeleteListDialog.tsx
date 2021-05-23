import React from "react";

import { Button, Callout, Dialog, Intent, IToastProps } from "@blueprintjs/core";
import { IExpansion, IPricelistJson, IRegionComposite, IShortProfession } from "@sotah-inc/core";

import { IClientRealm, IErrors } from "../../../types/global";
import { AuthLevel, FetchLevel, UserData } from "../../../types/main";
import { DialogActions, DialogBody } from "../../util";

export interface IStateProps {
  selectedList: IPricelistJson | null;
  userData: UserData;
  isDeleteListDialogOpen: boolean;
  deletePricelistErrors: IErrors;
  deletePricelistLevel: FetchLevel;
  selectedProfession: IShortProfession | null;
  selectedExpansion: IExpansion | null;
  currentRealm: IClientRealm | null;
  currentRegion: IRegionComposite | null;
}

export interface IDispatchProps {
  changeIsDeleteListDialogOpen: (isDialogOpen: boolean) => void;
  deletePricelist: (token: string, id: number) => void;
  deleteProfessionPricelist: (token: string, id: number) => void;
  insertToast: (toast: IToastProps) => void;
}

export interface IRouteProps {
  browseOnDeletion: (
    region: IRegionComposite,
    realm: IClientRealm,
    pricelist: IPricelistJson | null,
    professionData?: {
      profession: IShortProfession;
      expansion: IExpansion;
    },
  ) => void;
}

export type IOwnProps = IRouteProps;

export type Props = Readonly<IStateProps & IDispatchProps & IOwnProps>;

export class DeleteListDialog extends React.Component<Props> {
  public componentDidUpdate(prevProps: Props): void {
    const {
      deletePricelistErrors,
      deletePricelistLevel,
      currentRegion,
      currentRealm,
      selectedProfession,
      selectedExpansion,
      selectedList,
      browseOnDeletion,
      insertToast,
    } = this.props;

    if (currentRegion === null || currentRealm === null) {
      return;
    }

    if (prevProps.deletePricelistLevel !== deletePricelistLevel) {
      switch (deletePricelistLevel) {
      case FetchLevel.success: {
        insertToast({
          icon: "info-sign",
          intent: Intent.SUCCESS,
          message: "Your pricelist has been deleted.",
        });

        const professionData = (() => {
          if (selectedProfession === null || selectedExpansion === null) {
            return;
          }

          return { profession: selectedProfession, expansion: selectedExpansion };
        })();

        browseOnDeletion(currentRegion, currentRealm, selectedList, professionData);

        return;
      }
      case FetchLevel.failure:
        insertToast({
          icon: "warning-sign",
          intent: Intent.DANGER,
          message: `Failed to delete pricelist: ${Object.values(deletePricelistErrors)[0]}`,
        });

        return;
      default:
        return;
      }
    }
  }

  public render(): React.ReactNode {
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
            Are you sure you want to delete &quot;{selectedList.name}&quot;
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
      userData,
      selectedProfession,
      deleteProfessionPricelist,
    } = this.props;

    if (userData.authLevel !== AuthLevel.authenticated || selectedList === null) {
      return;
    }

    if (selectedProfession === null) {
      deletePricelist(userData.profile.token, selectedList.id);

      return;
    }

    deleteProfessionPricelist(userData.profile.token, selectedList.id);
  }
}
