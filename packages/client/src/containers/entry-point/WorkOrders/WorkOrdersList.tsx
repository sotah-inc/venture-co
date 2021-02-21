import { connect } from "react-redux";

import {
  IStateProps,
  WorkOrdersList,
} from "../../../components/entry-point/WorkOrders/WorkOrdersList";
import { IStoreState } from "../../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { orders } = state.WorkOrder;

  return { orders };
}

export const WorkOrdersListContainer = connect<
  IStateProps,
  Record<string, unknown>,
  Record<string, unknown>,
  IStoreState
>(mapStateToProps)(WorkOrdersList);
