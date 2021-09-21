import React from "react";

import { Classes, Intent, NonIdealState, Spinner } from "@blueprintjs/core";
import { IGetBootResponseData, IConfigRegion } from "@sotah-inc/core";

import { ILoadRegionEntrypoint } from "../../actions/main";
import { IClientRealm, IFetchData } from "../../types/global";
import { FetchLevel, UserData } from "../../types/main";

export interface IStateProps {
  currentRegion: IConfigRegion | null;
  currentRealm: IClientRealm | null;
  userData: UserData;
  realms: IFetchData<IClientRealm[]>;
  bootData: IFetchData<IGetBootResponseData>;
}

export interface IDispatchProps {
  onRegionChange: (region: IConfigRegion) => void;
  loadRegionEntrypoint: (payload: ILoadRegionEntrypoint) => void;
}

export interface IOwnProps {
  regionEntrypointData: ILoadRegionEntrypoint;
  label: string;
}

export interface IRouteProps {
  routeParams: IRouteParams;
  redirectToRealm: (region: IConfigRegion, realm: IClientRealm) => void;
}

export interface IRouteParams {
  region_name?: string;
}

export type Props = Readonly<IStateProps & IDispatchProps & IOwnProps & IRouteProps>;

export class RegionEntrypoint extends React.Component<Props> {
  public componentDidMount(): void {
    const { loadRegionEntrypoint, regionEntrypointData } = this.props;

    loadRegionEntrypoint(regionEntrypointData);
  }

  public render(): React.ReactNode {
    const {
      currentRegion,
      routeParams: { region_name },
    } = this.props;

    if (currentRegion === null || currentRegion.name !== region_name) {
      return this.renderUnmatched();
    }

    return this.renderMatched();
  }

  private renderMatched() {
    const { realms } = this.props;

    switch (realms.level) {
    case FetchLevel.prompted:
    case FetchLevel.fetching:
    case FetchLevel.refetching:
      return (
        <NonIdealState
          title="Loading realms"
          icon={<Spinner className={Classes.LARGE} intent={Intent.PRIMARY} />}
        />
      );
    case FetchLevel.failure:
      return (
        <NonIdealState
          title="Failed to load realms"
          icon={<Spinner className={Classes.LARGE} intent={Intent.DANGER} value={1} />}
        />
      );
    case FetchLevel.success:
      return this.renderMatchedWithRealms();
    case FetchLevel.initial:
    default:
      return (
        <NonIdealState
          title="Loading realms"
          icon={<Spinner className={Classes.LARGE} intent={Intent.NONE} value={0} />}
        />
      );
    }
  }

  private renderMatchedWithRealms() {
    const { currentRealm, currentRegion, redirectToRealm, label } = this.props;

    if (currentRegion === null || currentRealm === null) {
      return (
        <NonIdealState
          title="No region or realm!"
          icon={<Spinner className={Classes.LARGE} intent={Intent.DANGER} value={1} />}
        />
      );
    }

    redirectToRealm(currentRegion, currentRealm);

    return <p>Redirecting to {label}!</p>;
  }

  private renderUnmatched() {
    const {
      bootData,
      routeParams: { region_name },
    } = this.props;

    if (region_name === undefined) {
      return (
        <NonIdealState
          title={"Region is required!"}
          icon={<Spinner className={Classes.LARGE} intent={Intent.DANGER} value={1} />}
        />
      );
    }

    if (!bootData.data.regions.find(v => v.name === region_name)) {
      return (
        <NonIdealState
          title={`Region ${region_name} not found!`}
          icon={<Spinner className={Classes.LARGE} intent={Intent.DANGER} value={1} />}
        />
      );
    }

    return (
      <NonIdealState
        title="Changing region"
        icon={<Spinner className={Classes.LARGE} intent={Intent.NONE} />}
      />
    );
  }
}
