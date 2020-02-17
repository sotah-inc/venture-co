import React from "react";

import {
  GameVersion,
  IQueryWorkOrdersResponse,
  IRegion,
  IStatusRealm,
  OrderDirection,
  OrderKind,
  SortPerPage,
} from "@sotah-inc/core";

import { ILoadRealmEntrypoint } from "../../actions/main";
import { ILoadWorkOrderEntrypoint } from "../../actions/work-order";
import { IQueryWorkOrdersOptions } from "../../api/work-order";
import { WorkOrdersListContainer } from "../../containers/entry-point/WorkOrder/WorkOrdersList";
import { WorkOrdersNavContainer } from "../../containers/entry-point/WorkOrder/WorkOrdersNav";
import { IFetchData } from "../../types/global";
import { FetchLevel } from "../../types/main";
import { setTitle } from "../../util";

export interface IStateProps {
  orders: IFetchData<IQueryWorkOrdersResponse>;
  currentRegion: IRegion | null;
  currentRealm: IStatusRealm | null;
  perPage: SortPerPage;
  currentPage: number;
}

export interface IDispatchProps {
  loadWorkOrderEntrypoint: (payload: ILoadWorkOrderEntrypoint) => void;
  queryWorkOrders: (opts: IQueryWorkOrdersOptions) => void;
  loadRealmEntrypoint: (payload: ILoadRealmEntrypoint) => void;
}

export interface IOwnProps {
  workOrderEntrypointData: ILoadWorkOrderEntrypoint;
  realmEntrypointData: ILoadRealmEntrypoint;
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
    const {
      workOrderEntrypointData,
      loadWorkOrderEntrypoint,
      loadRealmEntrypoint,
      realmEntrypointData,
    } = this.props;

    loadWorkOrderEntrypoint(workOrderEntrypointData);
    loadRealmEntrypoint(realmEntrypointData);
  }

  public componentDidUpdate(prevProps: Props) {
    const {
      workOrderEntrypointData,
      loadWorkOrderEntrypoint,
      currentRegion,
      currentRealm,
      routeParams: { region_name, realm_slug },
      loadRealmEntrypoint,
      realmEntrypointData,
    } = this.props;

    if (prevProps.workOrderEntrypointData.loadId !== workOrderEntrypointData.loadId) {
      loadWorkOrderEntrypoint(workOrderEntrypointData);
      loadRealmEntrypoint(realmEntrypointData);

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
    const { currentRegion, currentRealm, orders, perPage, currentPage } = this.props;

    if (currentRegion === null || currentRealm === null) {
      return;
    }

    if (orders.level !== FetchLevel.success) {
      return;
    }

    const didOptionsChange = ((): boolean => {
      if (currentPage !== prevProps.currentPage) {
        return true;
      }

      return perPage !== prevProps.perPage;
    })();
    if (!didOptionsChange) {
      return;
    }

    this.refreshWorkOrders();
  }

  private refreshWorkOrders() {
    const { queryWorkOrders, currentRegion, currentRealm, perPage, currentPage } = this.props;

    if (currentRegion === null || currentRealm === null) {
      return;
    }

    queryWorkOrders({
      gameVersion: GameVersion.Retail,
      orderBy: OrderKind.CreatedAt,
      orderDirection: OrderDirection.Desc,
      page: currentPage,
      perPage,
      realmSlug: currentRealm.slug,
      regionName: currentRegion.name,
    });
  }
}
