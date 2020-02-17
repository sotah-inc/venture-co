import { connect } from "react-redux";

import { SetWorkOrderPage, SetWorkOrderPerPage } from "../../../actions/work-order";
import {
  IDispatchProps,
  IStateProps,
  WorkOrdersNav,
} from "../../../components/entry-point/WorkOrders/WorkOrdersNav";
import { IStoreState } from "../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const {
    perPage,
    orders: {
      data: { totalResults },
    },
    currentPage,
  } = state.WorkOrder;

  return { perPage, totalResults, currentPage };
};

const mapDispatchToProps: IDispatchProps = {
  setPage: SetWorkOrderPage,
  setPerPage: SetWorkOrderPerPage,
};

export const WorkOrdersNavContainer = connect<IStateProps, IDispatchProps, {}, IStoreState>(
  mapStateToProps,
  mapDispatchToProps,
)(WorkOrdersNav);
