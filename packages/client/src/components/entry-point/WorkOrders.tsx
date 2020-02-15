import React from "react";

import { IRegion, IStatusRealm, IWorkOrderJson } from "@sotah-inc/core";

import { ILoadWorkOrderEntrypoint } from "../../actions/work-order";
import { WorkOrdersListContainer } from "../../containers/entry-point/WorkOrder/WorkOrdersList";
import { WorkOrdersNavContainer } from "../../containers/entry-point/WorkOrder/WorkOrdersNav";
import { IFetchData } from "../../types/global";
import { FetchLevel } from "../../types/main";
import { setTitle } from "../../util";

export interface IStateProps {
  workOrder: IFetchData<IWorkOrderJson[]>;
}

export interface IDispatchProps {
  loadWorkOrderEntrypoint: (payload: ILoadWorkOrderEntrypoint) => void;
}

export interface IOwnProps {
  workOrderEntrypointData: ILoadWorkOrderEntrypoint;
}

export interface IRouteParams {
  region_name?: string;
  realm_slug?: string;
}

export interface IRouteProps {
  routeParams: IRouteParams;
  browseTo: (region: IRegion, realm: IStatusRealm) => void;
}

export type Props = Readonly<IDispatchProps & IStateProps & IOwnProps & IRouteProps>;

export class WorkOrders extends React.Component<Props> {
  public componentDidMount() {
    // props
    const { workOrderEntrypointData, loadWorkOrderEntrypoint } = this.props;

    loadWorkOrderEntrypoint(workOrderEntrypointData);
  }

  public componentDidUpdate(prevProps: Props) {
    // props
    const { workOrder, workOrderEntrypointData, loadWorkOrderEntrypoint } = this.props;

    if (prevProps.workOrderEntrypointData.loadId !== workOrderEntrypointData.loadId) {
      loadWorkOrderEntrypoint(workOrderEntrypointData);

      return;
    }

    if (workOrder.level !== FetchLevel.success) {
      return;
    }

    setTitle("Work Orders");
  }

  public render() {
    return (
      <>
        <WorkOrdersNavContainer />
        <WorkOrdersListContainer />
      </>
    );
  }
}
