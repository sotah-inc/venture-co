import React from "react";

import { Classes, Intent, NonIdealState, Spinner } from "@blueprintjs/core";
import { IRegionComposite } from "@sotah-inc/core";
import { ILoadRealmEntrypoint } from "../../actions/main";

import { IClientRealm, IRegions } from "../../types/global";
import { AuthLevel, FetchLevel } from "../../types/main";
import { setTitle } from "../../util";

export interface IStateProps {
  fetchRealmLevel: FetchLevel;
  realms: IClientRealm[];
  currentRegion: IRegionComposite | null;
  currentRealm: IClientRealm | null;
  authLevel: AuthLevel;
  regions: IRegions;
}

export interface IDispatchProps {
  loadRealmEntrypoint: (payload: ILoadRealmEntrypoint) => void;
}

export interface IOwnProps {
  realmEntrypointData: ILoadRealmEntrypoint;
}

export interface IRouteProps {
  routeParams: IRouteParams;
  redirectToRealmAuctions: (region: IRegionComposite, realm: IClientRealm) => void;
}

export interface IRouteParams {
  region_name: string;
  realm_slug: string;
}

export type Props = Readonly<IStateProps & IDispatchProps & IOwnProps & IRouteProps>;

export class Realm extends React.Component<Props> {
  public componentDidMount() {
    const { loadRealmEntrypoint, realmEntrypointData } = this.props;

    loadRealmEntrypoint(realmEntrypointData);
  }

  public render() {
    const {
      currentRegion,
      routeParams: { region_name },
    } = this.props;

    if (currentRegion === null) {
      return (
        <NonIdealState
          title="Loading region"
          icon={<Spinner className={Classes.LARGE} intent={Intent.DANGER} value={0} />}
        />
      );
    }

    if (currentRegion.config_region.name !== region_name) {
      return this.renderUnmatchedRegion();
    }

    return this.renderMatchedRegion();
  }

  private renderUnmatchedRegion() {
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

  private renderMatchedRegion() {
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
        return this.renderMatchedRegionWithRealms();
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

  private renderMatchedRegionWithRealms() {
    const {
      currentRealm,
      currentRegion,
      routeParams: { realm_slug },
      realms,
      redirectToRealmAuctions,
    } = this.props;

    if (currentRegion === null || currentRealm === null) {
      return (
        <NonIdealState
          title="No region or realm!"
          icon={<Spinner className={Classes.LARGE} intent={Intent.DANGER} value={1} />}
        />
      );
    }

    if (!(realm_slug in realms)) {
      return (
        <NonIdealState
          title={`Realm ${realm_slug} in region ${currentRegion.config_region.name} not found!`}
          icon={<Spinner className={Classes.LARGE} intent={Intent.DANGER} value={1} />}
        />
      );
    }

    if (realm_slug !== currentRealm.slug) {
      return (
        <NonIdealState
          title="Changing realm"
          icon={<Spinner className={Classes.LARGE} intent={Intent.NONE} />}
        />
      );
    }

    setTitle(
      `Redirecting to Auctions - ${currentRegion.config_region.name.toUpperCase()} ${
        currentRealm.name
      }`,
    );

    redirectToRealmAuctions(currentRegion, currentRealm);

    return <p>Redirecting to Auctions!</p>;
  }
}
