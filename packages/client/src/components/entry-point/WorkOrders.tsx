import React from "react";

import {
  GameVersion,
  IRegion,
  IStatusRealm,
  IWorkOrderJson,
  OrderDirection,
  OrderKind,
  SortPerPage,
} from "@sotah-inc/core";

import { ILoadWorkOrderEntrypoint } from "../../actions/work-order";
import { IQueryWorkOrdersOptions } from "../../api/work-order";
import { WorkOrdersListContainer } from "../../containers/entry-point/WorkOrder/WorkOrdersList";
import { WorkOrdersNavContainer } from "../../containers/entry-point/WorkOrder/WorkOrdersNav";
import { IFetchData } from "../../types/global";
import { FetchLevel } from "../../types/main";
import { setTitle } from "../../util";

export interface IStateProps {
  orders: IFetchData<IWorkOrderJson[]>;
  currentRegion: IRegion | null;
  currentRealm: IStatusRealm | null;
  perPage: SortPerPage;
}

export interface IDispatchProps {
  loadWorkOrderEntrypoint: (payload: ILoadWorkOrderEntrypoint) => void;
  queryWorkOrders: (opts: IQueryWorkOrdersOptions) => void;
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
    const { workOrderEntrypointData, loadWorkOrderEntrypoint } = this.props;

    loadWorkOrderEntrypoint(workOrderEntrypointData);
  }

  public componentDidUpdate(prevProps: Props) {
    const {
      workOrderEntrypointData,
      loadWorkOrderEntrypoint,
      currentRegion,
      currentRealm,
      routeParams: { region_name, realm_slug },
    } = this.props;

    if (prevProps.workOrderEntrypointData.loadId !== workOrderEntrypointData.loadId) {
      loadWorkOrderEntrypoint(workOrderEntrypointData);

      return;
    }

    if (currentRegion === null || currentRegion.name !== region_name) {
      return;
    }

    if (currentRealm === null || currentRealm.slug !== realm_slug) {
      return;
    }

    this.setTitle();
    this.refreshWorkOrdersTrigger(prevProps);
  }

  public render() {
    return (
      <>
        <WorkOrdersNavContainer />
        <WorkOrdersListContainer />
      </>
    );
  }

  private setTitle() {
    const { currentRegion, currentRealm } = this.props;

    if (currentRegion === null || currentRealm === null) {
      return;
    }

    setTitle(`Work Orders - ${currentRegion.name.toUpperCase()} ${currentRealm.name}`);
  }

  private refreshWorkOrdersTrigger(prevProps: Props) {
    const { currentRegion, currentRealm, orders, perPage } = this.props;

    if (currentRegion === null || currentRealm === null) {
      return;
    }

    if (orders.level !== FetchLevel.success) {
      return;
    }

    const didOptionsChange = ((): boolean => {
      return perPage !== prevProps.perPage;
    })();
    if (!didOptionsChange) {
      return;
    }

    this.refreshWorkOrders();
  }

  private refreshWorkOrders() {
    const { queryWorkOrders, currentRegion, currentRealm, perPage } = this.props;

    if (currentRegion === null || currentRealm === null) {
      return;
    }

    queryWorkOrders({
      gameVersion: GameVersion.Retail,
      orderBy: OrderKind.CreatedAt,
      orderDirection: OrderDirection.Desc,
      page: 1,
      perPage,
      realmSlug: currentRealm.slug,
      regionName: currentRegion.name,
    });
  }
}
