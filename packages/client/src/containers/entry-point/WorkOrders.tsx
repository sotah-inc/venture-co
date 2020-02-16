import { connect } from "react-redux";

import { LoadRealmEntrypoint } from "../../actions/main";
import { FetchWorkOrderQuery, LoadWorkOrderEntrypoint } from "../../actions/work-order";
import {
  IDispatchProps,
  IOwnProps,
  IRouteProps,
  IStateProps,
  WorkOrders,
} from "../../components/entry-point/WorkOrders";
import { IStoreState } from "../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { orders, perPage } = state.WorkOrder;
  const { currentRegion, currentRealm } = state.Main;

  return { orders, currentRegion, currentRealm, perPage };
};

const mapDispatchToProps: IDispatchProps = {
  loadRealmEntrypoint: LoadRealmEntrypoint,
  loadWorkOrderEntrypoint: LoadWorkOrderEntrypoint,
  queryWorkOrders: FetchWorkOrderQuery,
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
