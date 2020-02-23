import { connect } from "react-redux";

import { InsertToast } from "../../../actions/oven";
import { ChangeIsWorkOrderDialogOpen, FetchCreateWorkOrder } from "../../../actions/work-order";
import {
  CreateWorkOrderDialog,
  IDispatchProps,
  IStateProps,
} from "../../../components/entry-point/WorkOrders/CreateWorkOrderDialog";
import { IStoreState } from "../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { mutateOrderErrors, mutateOrderLevel, isWorkOrderDialogOpen } = state.WorkOrder;
  const { currentRegion, currentRealm, profile } = state.Main;

  return {
    currentRealm,
    currentRegion,
    isWorkOrderDialogOpen,
    mutateOrderErrors,
    mutateOrderLevel,
    profile,
  };
};

const mapDispatchToProps: IDispatchProps = {
  changeIsWorkOrderDialogOpen: ChangeIsWorkOrderDialogOpen,
  createWorkOrder: FetchCreateWorkOrder,
  insertToast: InsertToast,
};

export const CreateWorkOrderDialogContainer = connect<IStateProps, IDispatchProps, {}, IStoreState>(
  mapStateToProps,
  mapDispatchToProps,
)(CreateWorkOrderDialog);
