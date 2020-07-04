import React from "react";

import { Classes, Intent, NonIdealState, Spinner } from "@blueprintjs/core";
import { IRegionComposite, IStatusRealm } from "@sotah-inc/core";

import { ILoadRegionEntrypoint } from "../../actions/main";
import { IRegions } from "../../types/global";
import { AuthLevel, FetchLevel } from "../../types/main";

export interface IStateProps {
  currentRegion: IRegionComposite | null;
  currentRealm: IStatusRealm | null;
  authLevel: AuthLevel;
  regions: IRegions;
  fetchRealmLevel: FetchLevel;
}

export interface IDispatchProps {
  onRegionChange: (region: IRegionComposite) => void;
  loadRegionEntrypoint: (payload: ILoadRegionEntrypoint) => void;
}

export interface IOwnProps {
  regionEntrypointData: ILoadRegionEntrypoint;
}

export interface IRouteProps {
  routeParams: IRouteParams;
  browseToRealmData: (region: IRegionComposite, realm: IStatusRealm) => void;
}

export interface IRouteParams {
  region_name: string;
}

export type Props = Readonly<IStateProps & IDispatchProps & IOwnProps & IRouteProps>;

export class Region extends React.Component<Props> {
  public componentDidMount() {
    const { loadRegionEntrypoint, regionEntrypointData } = this.props;

    loadRegionEntrypoint(regionEntrypointData);
  }

  public render() {
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
    const { currentRealm, currentRegion, browseToRealmData } = this.props;

    if (currentRegion === null || currentRealm === null) {
      return (
        <NonIdealState
          title="No region or realm!"
          icon={<Spinner className={Classes.LARGE} intent={Intent.DANGER} value={1} />}
        />
      );
    }

    browseToRealmData(currentRegion, currentRealm);

    return <p>Redirecting to realm data!</p>;
  }

  private renderUnmatched() {
    const {
      regions,
      routeParams: { region_name },
    } = this.props;

    if (!(region_name in regions)) {
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
