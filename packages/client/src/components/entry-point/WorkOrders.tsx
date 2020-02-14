import React from "react";

import { IRegion, IStatusRealm, IWorkOrderJson, SortPerPage } from "@sotah-inc/core";

import { ILoadWorkOrderEntrypoint } from "../../actions/work-order";
import { WorkOrdersNavContainer } from "../../containers/entry-point/WorkOrder/WorkOrdersNav";
import { IFetchData } from "../../types/global";
import { FetchLevel } from "../../types/main";
import { setTitle } from "../../util";
import { WorkOrdersList } from "./WorkOrders/WorkOrdersList";

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
  browseTo: (region: IRegion, realm: IStatusRealm, page: number, perPage: SortPerPage) => void;
}

export type Props = Readonly<IDispatchProps & IStateProps & IOwnProps & IRouteProps>;

export class WorkOrders extends React.Component<Props> {
  public componentDidMount() {
    // props
    const { workOrderEntrypointData, loadWorkOrderEntrypoint } = this.props;

    loadWorkOrderEntrypoint(workOrderEntrypointData);
  }

  public componentDidUpdate() {
    // props
    const { workOrder } = this.props;

    if (workOrder.level !== FetchLevel.success) {
      return;
    }

    setTitle("Work Orders");
  }

  public render() {
    return (
      <>
        <WorkOrdersNavContainer />
        <WorkOrdersList />
      </>
    );
  }
}
