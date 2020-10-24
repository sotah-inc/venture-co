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
  IRegionComposite,
  ItemId,
  Locale,
  SortPerPage,
} from "@sotah-inc/core";
import React from "react";
import { ILoadAuctionListEntrypoint } from "../../actions/auction";
import { ILoadRealmEntrypoint } from "../../actions/main";

import { IGetAuctionsOptions } from "../../api/data";
import { CountToggleContainer } from "../../containers/entry-point/AuctionList/CountToggle";
// tslint:disable-next-line:max-line-length
import { QueryAuctionsFilterContainer } from "../../containers/entry-point/AuctionList/QueryAuctionsFilter";
import { RealmToggleContainer } from "../../containers/util/RealmToggle";
import { RegionToggleContainer } from "../../containers/util/RegionToggle";
// tslint:disable-next-line:max-line-length
import { AuctionTableRouteContainer } from "../../route-containers/entry-point/AuctionList/AuctionTable";
import { AuctionsOptions } from "../../types/auction";
import { IClientRealm, IFetchData, IItemsData, IRegions } from "../../types/global";
import { AuthLevel, FetchLevel } from "../../types/main";
import { hasNewItems, setTitle } from "../../util";
import { LastModified, Pagination } from "../util";

type ListAuction = IAuction | null;

export interface IStateProps {
  options: AuctionsOptions;
  auctionsResult: IFetchData<IItemsData<ListAuction[]>>;
  totalResults: number;
  fetchUserPreferencesLevel: FetchLevel;
  userPreferences: IPreferenceJson | null;
  activeSelect: boolean;

  fetchRealmLevel: FetchLevel;
  realms: IClientRealm[];
  currentRegion: IRegionComposite | null;
  currentRealm: IClientRealm | null;
  authLevel: AuthLevel;
  regions: IRegions;
}

export interface IDispatchProps {
  loadRealmEntrypoint: (payload: ILoadRealmEntrypoint) => void;
  loadAuctionListEntrypoint: (payload: ILoadAuctionListEntrypoint) => void;
  refreshAuctions: (opts: IGetAuctionsOptions) => void;
  setCurrentPage: (page: number) => void;
}

export interface IRouteProps {
  routeParams: IRouteParams;
  browseToRealmAuctions: (region: IRegionComposite, realm: IClientRealm) => void;
}

export interface IRouteParams {
  region_name: string;
  realm_slug: string;
}

export interface IOwnProps {
  realmEntrypointData: ILoadRealmEntrypoint;
  auctionListEntrypointData: ILoadAuctionListEntrypoint;
  loadId: string;
}

type Props = Readonly<IStateProps & IDispatchProps & IOwnProps & IRouteProps>;

export class AuctionList extends React.Component<Props> {
  public componentDidMount() {
    const {
      auctionListEntrypointData,
      loadAuctionListEntrypoint,
      loadRealmEntrypoint,
      realmEntrypointData,
    } = this.props;

    loadRealmEntrypoint(realmEntrypointData);
    loadAuctionListEntrypoint(auctionListEntrypointData);
  }

  public componentDidUpdate(prevProps: Props) {
    const {
      auctionListEntrypointData,
      loadAuctionListEntrypoint,
      loadRealmEntrypoint,
      realmEntrypointData,
      loadId,
      routeParams: { region_name, realm_slug },
      currentRegion,
      currentRealm,
    } = this.props;

    if (prevProps.loadId !== loadId) {
      loadRealmEntrypoint(realmEntrypointData);
      loadAuctionListEntrypoint(auctionListEntrypointData);

      return;
    }

    if (currentRegion === null || currentRegion.config_region.name !== region_name) {
      return;
    }

    if (currentRealm === null || currentRealm.realm.slug !== realm_slug) {
      return;
    }

    this.setTitle();
    this.refreshAuctionsTrigger(prevProps);
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

  private setTitle() {
    const { currentRegion, currentRealm } = this.props;

    if (currentRegion === null || currentRealm === null) {
      return;
    }

    setTitle(
      `Auctions - ${currentRegion.config_region.name.toUpperCase()} ${
        currentRealm.realm.name.en_US
      }`,
    );
  }

  private refreshAuctions() {
    const { options, refreshAuctions, currentRealm, currentRegion } = this.props;

    if (currentRegion === null || currentRealm === null) {
      return;
    }

    refreshAuctions({
      realmSlug: currentRealm.realm.slug,
      regionName: currentRegion.config_region.name,
      request: {
        count: options.auctionsPerPage,
        itemFilters: options.selected.reduce<ItemId[]>((result, v) => {
          if (v.item !== null) {
            return [...result, v.item.id];
          }

          return result;
        }, []),
        locale: Locale.EnUS,
        page: options.currentPage,
        sortDirection: options.sortDirection,
        sortKind: options.sortKind,
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

    const hasRealm = realms.reduce<boolean>(
      (result, v) => result || v.realm.slug === realm_slug,
      false,
    );
    if (!hasRealm) {
      return (
        <NonIdealState
          title={`Realm ${realm_slug} in region ${currentRegion.config_region.name} not found!`}
          icon={<Spinner className={Classes.LARGE} intent={Intent.DANGER} value={1} />}
        />
      );
    }

    if (realm_slug !== currentRealm.realm.slug) {
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
    const { currentRegion, currentRealm, auctionsResult } = this.props;

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

    switch (auctionsResult.level) {
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

  private refreshAuctionsTrigger(prevProps: Props) {
    const { currentRegion, currentRealm, activeSelect, auctionsResult, options } = this.props;

    if (currentRegion === null || currentRealm === null) {
      return;
    }

    if (auctionsResult.level !== FetchLevel.success) {
      return;
    }

    const didOptionsChange: boolean = (() => {
      if (options.currentPage !== prevProps.options.currentPage) {
        return true;
      }

      if (options.auctionsPerPage !== prevProps.options.auctionsPerPage) {
        return true;
      }

      if (options.sortDirection !== prevProps.options.sortDirection) {
        return true;
      }

      if (options.sortKind !== prevProps.options.sortKind) {
        return true;
      }

      if (
        activeSelect &&
        (hasNewItems(
          options.selected.map(v => v.item),
          prevProps.options.selected,
        ) ||
          options.selected.length !== prevProps.options.selected.length)
      ) {
        return true;
      }

      if (activeSelect && !prevProps.activeSelect) {
        return true;
      }

      return false;
    })();

    if (!didOptionsChange) {
      return;
    }

    this.refreshAuctions();
  }

  private renderRefetchingSpinner() {
    const { auctionsResult } = this.props;

    if (auctionsResult.level !== FetchLevel.refetching) {
      return null;
    }

    return <Spinner className={Classes.SMALL} intent={Intent.PRIMARY} />;
  }

  private renderAuctionsFooter() {
    const { currentRealm } = this.props;

    if (currentRealm === null) {
      return null;
    }

    return (
      <>
        <LastModified
          targetDate={new Date(currentRealm.realmModificationDates.downloaded * 1000)}
        />
      </>
    );
  }

  private getPageCount() {
    const {
      totalResults,
      options: { auctionsPerPage },
    } = this.props;

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

  private onRealmChange(realm: IClientRealm) {
    const { browseToRealmAuctions, currentRegion } = this.props;

    if (currentRegion === null) {
      return;
    }

    browseToRealmAuctions(currentRegion, realm);
  }

  private renderAuctions() {
    const {
      totalResults,
      setCurrentPage,
      options,
      auctionsResult: {
        data: { data: auctions },
      },
    } = this.props;

    // optionally appending blank auction lines
    if (totalResults > 0) {
      if (
        options.auctionsPerPage === SortPerPage.Ten &&
        auctions.length < options.auctionsPerPage
      ) {
        for (let i = auctions.length; i < options.auctionsPerPage; i++) {
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
              currentPage={options.currentPage}
              pagesShown={5}
              onPageChange={setCurrentPage}
            />
            <div style={{ marginLeft: "10px" }}>{this.renderRefetchingSpinner()}</div>
          </NavbarGroup>
          <NavbarGroup align={Alignment.RIGHT}>
            <ButtonGroup>
              <RealmToggleContainer onRealmChange={(v: IClientRealm) => this.onRealmChange(v)} />
              <RegionToggleContainer />
            </ButtonGroup>
          </NavbarGroup>
        </Navbar>
        <AuctionTableRouteContainer />
        <p style={{ textAlign: "center", margin: "10px auto" }}>
          Page {options.currentPage + 1} of {pageCount + 1}
        </p>
        {this.renderAuctionsFooter()}
      </>
    );
  }
}
