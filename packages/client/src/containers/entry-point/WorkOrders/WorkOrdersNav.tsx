import { connect } from "react-redux";

import { SetWorkOrderPage, SetWorkOrderPerPage } from "../../../actions/work-order";
import {
  IDispatchProps,
  IStateProps,
  WorkOrdersNav,
} from "../../../components/entry-point/WorkOrders/WorkOrdersNav";
import { IStoreState } from "../../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const {
    perPage,
    orders: {
      data: { totalResults },
    },
    currentPage,
  } = state.WorkOrder;
  const { currentRegion } = state.Main;

  return { perPage, totalResults, currentPage, currentRegion };
}

const mapDispatchToProps: IDispatchProps = {
  setPage: SetWorkOrderPage,
  setPerPage: SetWorkOrderPerPage,
};

export const WorkOrdersNavContainer = connect<
  IStateProps,
  IDispatchProps,
  Record<string, unknown>,
  IStoreState
>(
  mapStateToProps,
  mapDispatchToProps,
)(WorkOrdersNav);
