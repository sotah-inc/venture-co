import * as React from "react";

import { Classes, Intent, NonIdealState, Spinner } from "@blueprintjs/core";

import { IRealm, IRegion } from "../../../api-types/region";
import { IRealms, IRegions } from "../../../types/global";
import { AuthLevel, FetchLevel } from "../../../types/main";
import { setTitle } from "../../../util";

export interface IStateProps {
  fetchRealmLevel: FetchLevel;
  realms: IRealms;
  currentRegion: IRegion | null;
  currentRealm: IRealm | null;
  authLevel: AuthLevel;
  regions: IRegions;
}

export interface IDispatchProps {
  fetchRealms: (region: IRegion) => void;
  onRegionChange: (region: IRegion) => void;
  onRealmChange: (realm: IRealm) => void;
}

export interface IRouteProps {
  routeParams: IRouteParams;
  redirectToRealmAuctions: (region: IRegion, realm: IRealm) => void;
}

export interface IRouteParams {
  region_name: string;
  realm_slug: string;
}

export type IOwnProps = IRouteProps;

export type Props = Readonly<IStateProps & IDispatchProps & IOwnProps>;

export class Realm extends React.Component<Props> {
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

    if (currentRegion.name !== region_name) {
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
      default:
        return;
    }
  }

  public componentDidUpdate(prevProps: Props) {
    const {
      currentRegion,
      routeParams: { region_name, realm_slug },
      fetchRealmLevel,
      fetchRealms,
      currentRealm,
      onRealmChange,
      realms,
    } = this.props;

    if (currentRegion === null || currentRealm === null) {
      return;
    }

    if (currentRegion.name !== region_name) {
      return;
    }

    switch (fetchRealmLevel) {
      case FetchLevel.prompted:
        if (prevProps.fetchRealmLevel === fetchRealmLevel) {
          return;
        }

        fetchRealms(currentRegion);

        return;
      case FetchLevel.success:
        if (currentRealm.slug !== realm_slug) {
          if (!(realm_slug in realms)) {
            return;
          }

          onRealmChange(realms[realm_slug]);

          return;
        }

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

    if (currentRegion === null) {
      return (
        <NonIdealState
          title="Loading region"
          icon={<Spinner className={Classes.LARGE} intent={Intent.DANGER} value={0} />}
        />
      );
    }

    if (currentRegion.name !== region_name) {
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
          title={`Realm ${realm_slug} in region ${currentRegion.name} not found!`}
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

    setTitle(`Redirecting to Auctions - ${currentRegion.name.toUpperCase()} ${currentRealm.name}`);

    redirectToRealmAuctions(currentRegion, currentRealm);

    return <p>Redirecting to Auctions!</p>;
  }
}
