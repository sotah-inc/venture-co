import React from "react";

import { Dialog, IToastProps } from "@blueprintjs/core";
import { GameVersion, IPrefillWorkOrderItemResponseData, IRegionComposite } from "@sotah-inc/core";

import { ICreateWorkOrderOptions, IPrefillWorkOrderItemOptions } from "../../../api/work-order";
import {
  WorkOrderFormFormContainer,
} from "../../../form-containers/entry-point/WorkOrders/WorkOrderForm";
import { IClientRealm, IErrors, IFetchData, IProfile } from "../../../types/global";
import { FetchLevel } from "../../../types/main";

export interface IStateProps {
  isWorkOrderDialogOpen: boolean;
  mutateOrderLevel: FetchLevel;
  mutateOrderErrors: IErrors;
  currentRegion: IRegionComposite | null;
  currentRealm: IClientRealm | null;
  profile: IProfile | null;
  prefillWorkOrderItem: IFetchData<IPrefillWorkOrderItemResponseData>;
}

export interface IDispatchProps {
  changeIsWorkOrderDialogOpen: (isDialogOpen: boolean) => void;
  createWorkOrder: (token: string, opts: ICreateWorkOrderOptions) => void;
  insertToast: (toast: IToastProps) => void;
  callPrefillWorkOrderItem: (opts: IPrefillWorkOrderItemOptions) => void;
  resetWorkOrderItemPrefill: () => void;
}

export type Props = Readonly<IStateProps & IDispatchProps>;

export class CreateWorkOrderDialog extends React.Component<Props> {
  public render(): React.ReactNode {
    const {
      isWorkOrderDialogOpen,
      createWorkOrder,
      changeIsWorkOrderDialogOpen,
      currentRegion,
      currentRealm,
      mutateOrderLevel,
      mutateOrderErrors,
      insertToast,
      profile,
      prefillWorkOrderItem,
      callPrefillWorkOrderItem,
      resetWorkOrderItemPrefill,
    } = this.props;

    return (
      <Dialog
        isOpen={isWorkOrderDialogOpen}
        onClose={() => {
          changeIsWorkOrderDialogOpen(!isWorkOrderDialogOpen);
          resetWorkOrderItemPrefill();
        }}
        title="New Order"
        icon="manually-entered-data"
        canOutsideClickClose={false}
      >
        <WorkOrderFormFormContainer
          prefillWorkOrderItem={prefillWorkOrderItem}
          currentRegion={currentRegion}
          currentRealm={currentRealm}
          resetWorkOrderItemPrefill={resetWorkOrderItemPrefill}
          onSubmit={v => {
            if (profile === null || currentRegion === null || currentRealm === null) {
              return;
            }

            createWorkOrder(profile.token, {
              gameVersion: GameVersion.Retail,
              realmSlug: currentRealm.realm.slug,
              regionName: currentRegion.config_region.name,
              req: v,
            });
          }}
          isSubmitDisabled={mutateOrderLevel === FetchLevel.fetching}
          callPrefillWorkOrderItem={callPrefillWorkOrderItem}
          mutateOrderErrors={mutateOrderErrors}
          mutateOrderLevel={mutateOrderLevel}
          onComplete={() => {
            changeIsWorkOrderDialogOpen(!isWorkOrderDialogOpen);
            resetWorkOrderItemPrefill();
            insertToast({
              icon: "info-sign",
              intent: "success",
              message: "Your work-order has successfully been created!",
            });
          }}
          onFatalError={err => {
            insertToast({
              icon: "warning-sign",
              intent: "danger",
              message: `Could not create work-order: ${err}`,
            });
          }}
        />
      </Dialog>
    );
  }
}
