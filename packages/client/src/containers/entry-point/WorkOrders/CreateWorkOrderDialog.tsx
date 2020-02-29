import { connect } from "react-redux";

import { InsertToast } from "../../../actions/oven";
import {
  ChangeIsWorkOrderDialogOpen,
  FetchCreateWorkOrder,
  FetchWorkOrderItemPrefill,
  ResetWorkOrderItemPrefill,
} from "../../../actions/work-order";
import {
  CreateWorkOrderDialog,
  IDispatchProps,
  IStateProps,
} from "../../../components/entry-point/WorkOrders/CreateWorkOrderDialog";
import { IStoreState } from "../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const {
    mutateOrderErrors,
    mutateOrderLevel,
    isWorkOrderDialogOpen,
    prefillWorkOrderItem,
  } = state.WorkOrder;
  const { currentRegion, currentRealm, profile } = state.Main;

  return {
    currentRealm,
    currentRegion,
    isWorkOrderDialogOpen,
    mutateOrderErrors,
    mutateOrderLevel,
    prefillWorkOrderItem,
    profile,
  };
};

const mapDispatchToProps: IDispatchProps = {
  callPrefillWorkOrderItem: FetchWorkOrderItemPrefill,
  changeIsWorkOrderDialogOpen: ChangeIsWorkOrderDialogOpen,
  createWorkOrder: FetchCreateWorkOrder,
  insertToast: InsertToast,
  resetWorkOrderItemPrefill: ResetWorkOrderItemPrefill,
};

export const CreateWorkOrderDialogContainer = connect<IStateProps, IDispatchProps, {}, IStoreState>(
  mapStateToProps,
  mapDispatchToProps,
)(CreateWorkOrderDialog);
