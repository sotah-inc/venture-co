import React from "react";

import { Classes, Intent, NonIdealState, Spinner } from "@blueprintjs/core";
import { IRegion, IStatusRealm } from "@sotah-inc/core";

import { IRegions } from "../../types/global";
import { AuthLevel, FetchLevel } from "../../types/main";

export interface IStateProps {
  currentRegion: IRegion | null;
  currentRealm: IStatusRealm | null;
  authLevel: AuthLevel;
  regions: IRegions;
  fetchRealmLevel: FetchLevel;
}

export interface IDispatchProps {
  onRegionChange: (region: IRegion) => void;
  fetchRealms: (region: IRegion) => void;
}

export interface IRouteProps {
  routeParams: IRouteParams;
  browseToRealmData: (region: IRegion, realm: IStatusRealm) => void;
}

export interface IRouteParams {
  region_name: string;
}

export type IOwnProps = IRouteProps;

export type Props = Readonly<IOwnProps & IStateProps & IDispatchProps>;

export class Region extends React.Component<Props> {
  public componentDidMount() {
    const {
      routeParams: { region_name },
      regions,
      currentRegion,
      onRegionChange,
      fetchRealms,
      fetchRealmLevel,
    } = this.props;

    if (!(region_name in regions)) {
      return;
    }

    if (currentRegion === null) {
      onRegionChange(regions[region_name]);

      return;
    }

    if (currentRegion.name !== region_name) {
      onRegionChange(regions[region_name]);

      return;
    }

    switch (fetchRealmLevel) {
      case FetchLevel.initial:
        fetchRealms(currentRegion);

        return;
      default:
        return;
    }
  }

  public componentDidUpdate(prevProps: Props) {
    const {
      currentRegion,
      routeParams: { region_name },
      fetchRealmLevel,
      fetchRealms,
    } = this.props;

    if (currentRegion === null) {
      return;
    }

    if (currentRegion.name !== region_name) {
      return;
    }

    switch (fetchRealmLevel) {
      case FetchLevel.initial:
        fetchRealms(currentRegion);

        return;
      case FetchLevel.prompted:
        if (prevProps.fetchRealmLevel === fetchRealmLevel) {
          return;
        }

        fetchRealms(currentRegion);

        return;
      default:
        return;
    }
  }

  public render() {
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
