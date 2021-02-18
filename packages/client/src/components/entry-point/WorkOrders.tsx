import React from "react";

import {
  GameVersion,
  IQueryWorkOrdersResponseData,
  IRegionComposite,
  OrderDirection,
  OrderKind,
  SortPerPage,
} from "@sotah-inc/core";

import { ILoadRealmEntrypoint } from "../../actions/main";
import { ILoadWorkOrderEntrypoint } from "../../actions/work-order";
import { QueryWorkOrdersOptions } from "../../api/work-order";
import { CreateWorkOrderDialogContainer } from "../../containers/entry-point/WorkOrders/CreateWorkOrderDialog";
import { WorkOrdersListContainer } from "../../containers/entry-point/WorkOrders/WorkOrdersList";
import { WorkOrdersNavRouteContainer } from "../../route-containers/entry-point/WorkOrders/WorkOrdersNav";
import { IClientRealm, IFetchData } from "../../types/global";
import { FetchLevel } from "../../types/main";
import { setTitle } from "../../util";

export interface IStateProps {
  orders: IFetchData<IQueryWorkOrdersResponseData>;
  currentRegion: IRegionComposite | null;
  currentRealm: IClientRealm | null;
  perPage: SortPerPage;
  currentPage: number;
}

export interface IDispatchProps {
  loadWorkOrderEntrypoint: (payload: ILoadWorkOrderEntrypoint) => void;
  queryWorkOrders: (opts: QueryWorkOrdersOptions) => void;
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
  browseTo: (region: IRegionComposite, realm: IClientRealm) => void;
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

    if (currentRegion === null || currentRegion.config_region.name !== region_name) {
      return;
    }

    if (currentRealm === null || currentRealm.realm.slug !== realm_slug) {
      return;
    }

    this.setTitle();
    this.refreshWorkOrdersTrigger(prevProps);
  }

  public render(): React.ReactNode {
    return (
      <>
        <CreateWorkOrderDialogContainer />
        <WorkOrdersNavRouteContainer />
        <WorkOrdersListContainer />
      </>
    );
  }

  private setTitle() {
    const { currentRegion, currentRealm } = this.props;

    if (currentRegion === null || currentRealm === null) {
      return;
    }

    setTitle(
      `Work Orders - ${currentRegion.config_region.name.toUpperCase()} ${currentRealm.realm.name}`,
    );
  }

  private refreshWorkOrdersTrigger(prevProps: Props) {
    const { currentRegion, currentRealm, orders, perPage, currentPage } = this.props;

    if (currentRegion === null || currentRealm === null) {
      return;
    }

    if (prevProps.orders.level !== orders.level && orders.level === FetchLevel.prompted) {
      this.refreshWorkOrders();

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
      page: currentPage + 1,
      perPage,
      realmSlug: currentRealm.realm.slug,
      regionName: currentRegion.config_region.name,
    });
  }
}
