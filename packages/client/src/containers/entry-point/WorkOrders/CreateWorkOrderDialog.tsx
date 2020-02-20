import { connect } from "react-redux";

import { ChangeIsWorkOrderDialogOpen, FetchCreateWorkOrder } from "../../../actions/work-order";
import {
  CreateWorkOrderDialog,
  IDispatchProps,
  IStateProps,
} from "../../../components/entry-point/WorkOrders/CreateWorkOrderDialog";
import { IStoreState } from "../../../types";
import { InsertToast } from "../../../actions/oven";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { mutateOrderErrors, mutateOrderLevel, isWorkOrderDialogOpen } = state.WorkOrder;
  const { currentRegion, currentRealm } = state.Main;

  return {
    currentRealm,
    currentRegion,
    isWorkOrderDialogOpen,
    mutateOrderErrors,
    mutateOrderLevel,
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
