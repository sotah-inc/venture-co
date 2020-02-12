import { connect } from "react-redux";

import { LoadWorkOrderEntrypoint } from "../../actions/work-order";
import {
  IDispatchProps,
  IOwnProps,
  IRouteProps,
  IStateProps,
  WorkOrders,
} from "../../components/entry-point/WorkOrders";
import { IStoreState } from "../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { orders } = state.WorkOrder;
  return { workOrder: orders };
};

const mapDispatchToProps: IDispatchProps = {
  loadWorkOrderEntrypoint: LoadWorkOrderEntrypoint,
};

export const WorkOrdersContainer = connect<
  IStateProps,
  IDispatchProps,
  IOwnProps & IRouteProps,
  IStoreState
>(
  mapStateToProps,
  mapDispatchToProps,
)(WorkOrders);
