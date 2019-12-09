import React from "react";

import { Button, Callout, Dialog, Intent, IToastProps } from "@blueprintjs/core";
import { IExpansion, IPricelistJson, IProfession, IRegion, IStatusRealm } from "@sotah-inc/core";

import { IErrors, IProfile } from "../../../types/global";
import { FetchLevel } from "../../../types/main";
import { DialogActions, DialogBody } from "../../util";

export interface IStateProps {
  selectedList: IPricelistJson | null;
  profile: IProfile | null;
  isDeleteListDialogOpen: boolean;
  deletePricelistErrors: IErrors;
  deletePricelistLevel: FetchLevel;
  selectedProfession: IProfession | null;
  selectedExpansion: IExpansion | null;
  currentRealm: IStatusRealm | null;
  currentRegion: IRegion | null;
}

export interface IDispatchProps {
  changeIsDeleteListDialogOpen: (isDialogOpen: boolean) => void;
  deletePricelist: (token: string, id: number) => void;
  deleteProfessionPricelist: (token: string, id: number) => void;
  insertToast: (toast: IToastProps) => void;
}

export interface IRouteProps {
  browseOnDeletion: (
    region: IRegion,
    realm: IStatusRealm,
    pricelist: IPricelistJson | null,
    professionData?: {
      profession: IProfession;
      expansion: IExpansion;
    },
  ) => void;
}

export type IOwnProps = IRouteProps;

export type Props = Readonly<IStateProps & IDispatchProps & IOwnProps>;

export class DeleteListDialog extends React.Component<Props> {
  public componentDidUpdate(prevProps: Props) {
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
        case FetchLevel.success:
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
