import { connect } from "react-redux";

import {
  IStateProps,
  WorkOrdersList,
} from "../../../components/entry-point/WorkOrders/WorkOrdersList";
import { IStoreState } from "../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { orders } = state.WorkOrder;
  const { currentRealm, currentRegion } = state.Main;

  return { orders, currentRealm, currentRegion };
};

export const WorkOrdersListContainer = connect<IStateProps, {}, {}, IStoreState>(mapStateToProps)(
  WorkOrdersList,
);
