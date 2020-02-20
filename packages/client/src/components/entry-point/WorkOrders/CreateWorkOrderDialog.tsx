import React from "react";

import { Dialog, IToastProps } from "@blueprintjs/core";
import { GameVersion, IRegion, IStatusRealm } from "@sotah-inc/core";

import { ICreateWorkOrderOptions } from "../../../api/work-order";
import { WorkOrderFormFormContainer } from "../../../form-containers/entry-point/WorkOrders/WorkOrderForm";
import { IErrors } from "../../../types/global";
import { FetchLevel } from "../../../types/main";

export interface IStateProps {
  isWorkOrderDialogOpen: boolean;
  mutateOrderLevel: FetchLevel;
  mutateOrderErrors: IErrors;
  currentRegion: IRegion | null;
  currentRealm: IStatusRealm | null;
}

export interface IDispatchProps {
  changeIsWorkOrderDialogOpen: (isDialogOpen: boolean) => void;
  createWorkOrder: (opts: ICreateWorkOrderOptions) => void;
  insertToast: (toast: IToastProps) => void;
}

export type Props = Readonly<IStateProps & IDispatchProps>;

export class CreateWorkOrderDialog extends React.Component<Props> {
  public render() {
    const {
      isWorkOrderDialogOpen,
      createWorkOrder,
      changeIsWorkOrderDialogOpen,
      currentRegion,
      currentRealm,
      mutateOrderLevel,
      mutateOrderErrors,
      insertToast,
    } = this.props;

    return (
      <Dialog
        isOpen={isWorkOrderDialogOpen}
        onClose={() => changeIsWorkOrderDialogOpen(!isWorkOrderDialogOpen)}
        title="New Order"
        icon="manually-entered-data"
        canOutsideClickClose={false}
      >
        <WorkOrderFormFormContainer
          onSubmit={v => {
            if (currentRegion === null || currentRealm === null) {
              return;
            }

            createWorkOrder({
              gameVersion: GameVersion.Retail,
              realmSlug: currentRealm.slug,
              regionName: currentRegion.name,
              req: v,
            });
          }}
          isSubmitDisabled={mutateOrderLevel === FetchLevel.fetching}
          mutateOrderErrors={mutateOrderErrors}
          mutateOrderLevel={mutateOrderLevel}
          onComplete={() => {
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
