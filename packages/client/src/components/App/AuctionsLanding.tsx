import React from "react";

import { Classes, Intent, NonIdealState, Spinner } from "@blueprintjs/core";
import { IRegionComposite, IStatusRealm } from "@sotah-inc/core";

import { IRegions } from "../../types/global";
import { FetchLevel } from "../../types/main";
import { setTitle } from "../../util";

export interface IStateProps {
  currentRegion: IRegionComposite | null;
  currentRealm: IClientRealm | null;
  fetchRealmLevel: FetchLevel;
  regions: IRegions;
}

export interface IDispatchProps {
  fetchRealms: (region: IRegionComposite) => void;
  onRegionChange: (region: IRegionComposite) => void;
}

export interface IRouteProps {
  routeParams: IRouteParams;
  redirectToAuctions: (region: IRegionComposite, realm: IStatusRealm) => void;
}

export interface IRouteParams {
  region_name?: string;
}

export type IOwnProps = IRouteProps;

export type Props = Readonly<IStateProps & IDispatchProps & IOwnProps>;

export class AuctionsLanding extends React.Component<Props> {
  public componentDidMount() {
    const {
      currentRegion,
      routeParams: { region_name },
      onRegionChange,
      regions,
      fetchRealmLevel,
      fetchRealms,
    } = this.props;

    if (currentRegion === null) {
      return;
    }

    if (typeof region_name === "undefined") {
      switch (fetchRealmLevel) {
        case FetchLevel.initial:
        case FetchLevel.prompted:
          fetchRealms(currentRegion);

          return;
        case FetchLevel.success:
          break;
        default:
          return;
      }

      this.setTitle();

      return;
    }

    if (currentRegion.config_region.name !== region_name) {
      if (region_name in regions) {
        onRegionChange(regions[region_name]);

        return;
      }

      return;
    }

    switch (fetchRealmLevel) {
      case FetchLevel.initial:
      case FetchLevel.prompted:
        fetchRealms(currentRegion);

        return;
      case FetchLevel.success:
        break;
      default:
        return;
    }

    this.setTitle();
  }

  public componentDidUpdate() {
    const {
      routeParams: { region_name },
      fetchRealmLevel,
      currentRegion,
      fetchRealms,
      currentRealm,
      regions,
      onRegionChange,
    } = this.props;

    if (currentRegion === null) {
      return;
    }

    if (typeof region_name !== "undefined" && currentRegion.config_region.name !== region_name) {
      switch (fetchRealmLevel) {
        case FetchLevel.success:
          if (!(region_name in regions)) {
            return;
          }

          onRegionChange(regions[region_name]);

          return;
        default:
          return;
      }
    }

    switch (fetchRealmLevel) {
      case FetchLevel.initial:
      case FetchLevel.prompted:
        fetchRealms(currentRegion);

        return;
      case FetchLevel.success:
        break;
      default:
        return;
    }

    if (currentRealm === null) {
      return;
    }

    this.setTitle();
  }

  public render() {
    const {
      currentRealm,
      currentRegion,
      fetchRealmLevel,
      routeParams: { region_name },
      redirectToAuctions,
    } = this.props;

    if (currentRegion === null) {
      return (
        <NonIdealState
          title="Loading region"
          icon={<Spinner className={Classes.LARGE} intent={Intent.DANGER} value={0} />}
        />
      );
    }

    if (typeof region_name !== "undefined" && currentRegion.config_region.name !== region_name) {
      return (
        <NonIdealState
          title="Changing region"
          icon={<Spinner className={Classes.LARGE} intent={Intent.NONE} />}
        />
      );
    }

    switch (fetchRealmLevel) {
      case FetchLevel.success:
        break;
      case FetchLevel.failure:
        return (
          <NonIdealState
            title="Failed to load realms"
            icon={<Spinner className={Classes.LARGE} intent={Intent.DANGER} value={1} />}
          />
        );
      case FetchLevel.fetching:
        return (
          <NonIdealState
            title="Loading realms"
            icon={<Spinner className={Classes.LARGE} intent={Intent.PRIMARY} />}
          />
        );
      case FetchLevel.initial:
      default:
        return (
          <NonIdealState
            title="Loading realms"
            icon={<Spinner className={Classes.LARGE} intent={Intent.NONE} />}
          />
        );
    }

    if (currentRealm === null) {
      return (
        <NonIdealState
          title="Loading realm"
          icon={<Spinner className={Classes.LARGE} intent={Intent.DANGER} value={0} />}
        />
      );
    }

    redirectToAuctions(currentRegion, currentRealm);

    return <p>Redirecting to auctions!</p>;
  }

  private setTitle() {
    const { currentRegion, currentRealm } = this.props;

    if (currentRegion === null || currentRealm === null) {
      return;
    }

    setTitle(
      `Redirecting to Auctions - ${currentRegion.config_region.name.toUpperCase()} ${
        currentRealm.name
      }`,
    );
  }
}
