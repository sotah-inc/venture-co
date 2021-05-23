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

function mapStateToProps(state: IStoreState): IStateProps {
  const {
    mutateOrderErrors,
    mutateOrderLevel,
    isWorkOrderDialogOpen,
    prefillWorkOrderItem,
  } = state.WorkOrder;
  const { currentRegion, currentRealm, userData } = state.Main;

  return {
    currentRealm,
    currentRegion,
    isWorkOrderDialogOpen,
    mutateOrderErrors,
    mutateOrderLevel,
    prefillWorkOrderItem,
    userData,
  };
}

const mapDispatchToProps: IDispatchProps = {
  callPrefillWorkOrderItem: FetchWorkOrderItemPrefill,
  changeIsWorkOrderDialogOpen: ChangeIsWorkOrderDialogOpen,
  createWorkOrder: FetchCreateWorkOrder,
  insertToast: InsertToast,
  resetWorkOrderItemPrefill: ResetWorkOrderItemPrefill,
};

export const CreateWorkOrderDialogContainer = connect<
  IStateProps,
  IDispatchProps,
  Record<string, unknown>,
  IStoreState
>(
  mapStateToProps,
  mapDispatchToProps,
)(CreateWorkOrderDialog);
