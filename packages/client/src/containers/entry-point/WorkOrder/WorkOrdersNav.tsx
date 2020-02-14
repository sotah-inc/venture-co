import { connect } from "react-redux";

import { SetWorkOrderPerPage } from "../../../actions/work-order";
import {
  IDispatchProps,
  IStateProps,
  WorkOrdersNav,
} from "../../../components/entry-point/WorkOrders/WorkOrdersNav";
import { IStoreState } from "../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { perPage } = state.WorkOrder;
  return { perPage };
};

const mapDispatchToProps: IDispatchProps = {
  setPerPage: SetWorkOrderPerPage,
};

export const WorkOrdersNavContainer = connect<IStateProps, IDispatchProps, {}, IStoreState>(
  mapStateToProps,
  mapDispatchToProps,
)(WorkOrdersNav);
