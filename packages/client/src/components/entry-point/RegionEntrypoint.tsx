import React from "react";

import { Classes, Intent, NonIdealState, Spinner } from "@blueprintjs/core";
import { IRegionComposite } from "@sotah-inc/core";

import { ILoadRegionEntrypoint } from "../../actions/main";
import { IClientRealm } from "../../types/global";
import { AuthLevel, FetchLevel } from "../../types/main";

export interface IStateProps {
  currentRegion: IRegionComposite | null;
  currentRealm: IClientRealm | null;
  authLevel: AuthLevel;
  regions: IRegionComposite[];
  fetchRealmLevel: FetchLevel;
}

export interface IDispatchProps {
  onRegionChange: (region: IRegionComposite) => void;
  loadRegionEntrypoint: (payload: ILoadRegionEntrypoint) => void;
}

export interface IOwnProps {
  regionEntrypointData: ILoadRegionEntrypoint;
  label: string;
}

export interface IRouteProps {
  routeParams: IRouteParams;
  redirectToRealm: (region: IRegionComposite, realm: IClientRealm) => void;
}

export interface IRouteParams {
  region_name?: string;
}

export type Props = Readonly<IStateProps & IDispatchProps & IOwnProps & IRouteProps>;

export class RegionEntrypoint extends React.Component<Props> {
  public componentDidMount() {
    const { loadRegionEntrypoint, regionEntrypointData } = this.props;

    loadRegionEntrypoint(regionEntrypointData);
  }

  public render(): React.ReactNode {
    const {
      currentRegion,
      routeParams: { region_name },
    } = this.props;

    if (currentRegion === null || currentRegion.config_region.name !== region_name) {
      return this.renderUnmatched();
    }

    return this.renderMatched();
  }

  private renderMatched() {
    const { fetchRealmLevel } = this.props;

    switch (fetchRealmLevel) {
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
      regions,
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

    if (!regions.map(v => v.config_region.name).includes(region_name)) {
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
