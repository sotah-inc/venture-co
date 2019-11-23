import {
  Alignment,
  ButtonGroup,
  Classes,
  Intent,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NonIdealState,
  Spinner,
} from "@blueprintjs/core";
import {
  IAuction,
  IPreferenceJson,
  IQueryAuctionsItem,
  IRegion,
  IStatusRealm,
  ItemId,
  OwnerName,
  SortDirection,
  SortKind,
} from "@sotah-inc/core";
import React from "react";
import { ILoadRealmEntrypoint } from "../../actions/main";

import { IGetAuctionsOptions, IQueryAuctionsOptions } from "../../api/data";
import { CountToggleContainer } from "../../containers/App/Data/AuctionList/CountToggle";
// tslint:disable-next-line:max-line-length
import { QueryAuctionsFilterContainer } from "../../containers/App/Data/AuctionList/QueryAuctionsFilter";
import { RealmToggleContainer } from "../../containers/util/RealmToggle";
import { RegionToggleContainer } from "../../containers/util/RegionToggle";
// tslint:disable-next-line:max-line-length
import { AuctionTableRouteContainer } from "../../route-containers/App/Data/AuctionList/AuctionTable";
import { IRealms, IRegions } from "../../types/global";
import { AuthLevel, FetchLevel } from "../../types/main";
import { didRealmChange, setTitle } from "../../util";
import { LastModified, Pagination } from "../util";

type ListAuction = IAuction | null;

export interface IStateProps {
  fetchAuctionsLevel: FetchLevel;
  auctions: ListAuction[];
  currentPage: number;
  auctionsPerPage: number;
  totalResults: number;
  sortKind: SortKind;
  sortDirection: SortDirection;
  queryAuctionsLevel: FetchLevel;
  selectedQueryAuctionResults: IQueryAuctionsItem[];
  fetchUserPreferencesLevel: FetchLevel;
  userPreferences: IPreferenceJson | null;
  activeSelect: boolean;
  fetchRealmLevel: FetchLevel;
  realms: IRealms;
  currentRegion: IRegion | null;
  currentRealm: IStatusRealm | null;
  authLevel: AuthLevel;
  regions: IRegions;
}

export interface IDispatchProps {
  loadRealmEntrypoint: (payload: ILoadRealmEntrypoint) => void;
  refreshAuctions: (opts: IGetAuctionsOptions) => void;
  setCurrentPage: (page: number) => void;
  refreshAuctionsQuery: (opts: IQueryAuctionsOptions) => void;
}

export interface IRouteProps {
  routeParams: IRouteParams;
  browseToRealmAuctions: (region: IRegion, realm: IStatusRealm) => void;
}

export interface IRouteParams {
  region_name: string;
  realm_slug: string;
}

export interface IOwnProps {
  realmEntrypointData: ILoadRealmEntrypoint;
}

type Props = Readonly<IStateProps & IDispatchProps & IOwnProps & IRouteProps>;

export class AuctionList extends React.Component<Props> {
  public componentDidMount() {
    const { loadRealmEntrypoint, realmEntrypointData } = this.props;

    loadRealmEntrypoint(realmEntrypointData);
  }

  public componentDidUpdate(prevProps: Props) {
    const {
      routeParams: { region_name, realm_slug },
      currentRegion,
      currentRealm,
    } = this.props;

    if (currentRegion === null || currentRegion.name !== region_name) {
      return;
    }

    if (currentRealm === null || currentRealm.slug !== realm_slug) {
      return;
    }

    this.setTitle();
    this.refreshAuctionsTrigger(prevProps);
    this.refreshAuctionsQueryTrigger(prevProps);
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

  private setTitle() {
    const { currentRegion, currentRealm } = this.props;

    if (currentRegion === null || currentRealm === null) {
      return;
    }

    setTitle(`Auctions - ${currentRegion.name.toUpperCase()} ${currentRealm.name}`);
  }

  private refreshAuctions() {
    const {
      selectedQueryAuctionResults,
      refreshAuctions,
      currentRealm,
      currentRegion,
      auctionsPerPage,
      currentPage,
      sortDirection,
      sortKind,
    } = this.props;

    if (currentRegion === null || currentRealm === null) {
      return;
    }

    const ownerFilters: OwnerName[] = selectedQueryAuctionResults
      .filter(v => v.owner !== null)
      .map(v => v.owner!.name);
    const itemFilters: ItemId[] = selectedQueryAuctionResults
      .filter(v => v.item !== null)
      .map(v => v.item!.id);
    refreshAuctions({
      realmSlug: currentRealm.slug,
      regionName: currentRegion.name,
      request: {
        count: auctionsPerPage,
        itemFilters,
        ownerFilters,
        page: currentPage,
        sortDirection,
        sortKind,
      },
    });
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

    return this.renderContent();
  }

  private renderContent() {
    const { currentRegion, currentRealm } = this.props;

    if (currentRegion === null) {
      return (
        <NonIdealState
          title="Loading region"
          icon={<Spinner className={Classes.LARGE} intent={Intent.NONE} value={0} />}
        />
      );
    }

    if (currentRealm === null) {
      return (
        <NonIdealState
          title="Loading realm"
          icon={<Spinner className={Classes.LARGE} intent={Intent.NONE} value={0} />}
        />
      );
    }

    switch (this.props.fetchAuctionsLevel) {
      case FetchLevel.initial:
        return (
          <NonIdealState
            title="Loading auctions"
            icon={<Spinner className={Classes.LARGE} intent={Intent.NONE} value={0} />}
          />
        );
      case FetchLevel.fetching:
        return (
          <NonIdealState
            title="Loading auctions"
            icon={<Spinner className={Classes.LARGE} intent={Intent.PRIMARY} />}
          />
        );
      case FetchLevel.failure:
        return (
          <NonIdealState
            title="Fetch auctions failure"
            description="Auctions could not be fetched"
            icon="error"
          />
        );
      case FetchLevel.refetching:
      case FetchLevel.success:
        return this.renderAuctions();
      default:
        return <>You should never see this!</>;
    }
  }

  private refreshAuctionsQueryTrigger(prevProps: Props) {
    const { currentRegion, currentRealm, refreshAuctionsQuery } = this.props;

    if (currentRegion === null || currentRealm === null) {
      return;
    }

    if (!didRealmChange(prevProps.currentRealm, currentRealm)) {
      return;
    }

    refreshAuctionsQuery({
      query: "",
      realmSlug: currentRealm.slug,
      regionName: currentRegion.name,
    });
  }

  private refreshAuctionsTrigger(prevProps: Props) {
    const {
      fetchAuctionsLevel,
      currentRegion,
      currentRealm,
      currentPage,
      auctionsPerPage,
      sortDirection,
      selectedQueryAuctionResults,
      activeSelect,
    } = this.props;

    if (currentRegion === null || currentRealm === null) {
      return;
    }

    switch (fetchAuctionsLevel) {
      case FetchLevel.initial:
        this.refreshAuctions();

        return;
      case FetchLevel.success:
        const didOptionsChange: boolean = (() => {
          if (didRealmChange(prevProps.currentRealm, currentRealm)) {
            return true;
          }

          if (currentPage !== prevProps.currentPage) {
            return true;
          }

          if (auctionsPerPage !== prevProps.auctionsPerPage) {
            return true;
          }

          if (prevProps.sortDirection !== sortDirection) {
            return true;
          }

          if (prevProps.sortKind !== this.props.sortKind) {
            return true;
          }

          const didSelectedAuctionsQueryChange =
            activeSelect &&
            prevProps.selectedQueryAuctionResults.length !== selectedQueryAuctionResults.length;
          if (didSelectedAuctionsQueryChange) {
            return true;
          }

          if (prevProps.activeSelect !== activeSelect) {
            return true;
          }

          return false;
        })();

        if (didOptionsChange) {
          this.refreshAuctions();

          return;
        }

        return;
      default:
        return;
    }
  }

  private renderRefetchingSpinner() {
    const { fetchAuctionsLevel } = this.props;
    if (fetchAuctionsLevel !== FetchLevel.refetching) {
      return null;
    }

    return <Spinner className={Classes.SMALL} intent={Intent.PRIMARY} />;
  }

  private renderAuctionsFooter() {
    const { currentRealm } = this.props;

    return (
      <>
        <LastModified
          targetDate={new Date(currentRealm!.realm_modification_dates.downloaded * 1000)}
        />
      </>
    );
  }

  private getPageCount() {
    const { totalResults, auctionsPerPage } = this.props;

    let pageCount = 0;
    if (totalResults > 0) {
      pageCount = totalResults / auctionsPerPage - 1;
      const remainder = totalResults % auctionsPerPage;
      if (remainder > 0) {
        pageCount = (totalResults - remainder) / auctionsPerPage;
      }
    }

    return pageCount;
  }

  private onRealmChange(realm: IStatusRealm) {
    const { browseToRealmAuctions, currentRegion } = this.props;

    if (currentRegion === null) {
      return;
    }

    browseToRealmAuctions(currentRegion, realm);
  }

  private renderAuctions() {
    const { auctions, totalResults, auctionsPerPage, currentPage, setCurrentPage } = this.props;

    // optionally appending blank auction lines
    if (totalResults > 0) {
      if (auctionsPerPage === 10 && auctions.length < auctionsPerPage) {
        for (let i = auctions.length; i < auctionsPerPage; i++) {
          auctions[i] = null;
        }
      }
    }

    const pageCount = this.getPageCount();

    return (
      <>
        <QueryAuctionsFilterContainer />
        <Navbar>
          <NavbarGroup align={Alignment.LEFT}>
            <CountToggleContainer />
            <NavbarDivider />
            <Pagination
              pageCount={pageCount}
              currentPage={currentPage}
              pagesShown={5}
              onPageChange={setCurrentPage}
            />
            <div style={{ marginLeft: "10px" }}>{this.renderRefetchingSpinner()}</div>
          </NavbarGroup>
          <NavbarGroup align={Alignment.RIGHT}>
            <ButtonGroup>
              <RealmToggleContainer onRealmChange={(v: IStatusRealm) => this.onRealmChange(v)} />
              <RegionToggleContainer />
            </ButtonGroup>
          </NavbarGroup>
        </Navbar>
        <AuctionTableRouteContainer />
        <p style={{ textAlign: "center", margin: "10px auto" }}>
          Page {currentPage + 1} of {pageCount + 1}
        </p>
        {this.renderAuctionsFooter()}
      </>
    );
  }
}
