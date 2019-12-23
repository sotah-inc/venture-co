import { connect } from "react-redux";

import { FetchAuctions, LoadAuctionListEntrypoint, PageChange } from "../../actions/auction";
import { LoadRealmEntrypoint } from "../../actions/main";
import {
  AuctionList,
  IDispatchProps,
  IOwnProps,
  IRouteProps,
  IStateProps,
} from "../../components/entry-point/AuctionList";
import { IStoreState } from "../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const {
    currentRegion,
    currentRealm,
    authLevel,
    fetchUserPreferencesLevel,
    userPreferences,
    fetchRealmLevel,
    realms,
    regions,
  } = state.Main;
  const {
    fetchAuctionsLevel,
    auctions,
    currentPage,
    auctionsPerPage,
    totalResults,
    sortDirection,
    sortKind,
    queryAuctionsLevel,
    selectedQueryAuctionResults,
    activeSelect,
  } = state.Auction;
  return {
    activeSelect,
    auctions: auctions.data,
    auctionsPerPage,
    authLevel,
    currentPage,
    currentRealm,
    currentRegion,
    fetchAuctionsLevel,
    fetchRealmLevel,
    fetchUserPreferencesLevel,
    queryAuctionsLevel,
    realms,
    regions,
    selectedQueryAuctionResults,
    sortDirection,
    sortKind,
    totalResults,
    userPreferences,
  };
};

const mapDispatchToProps: IDispatchProps = {
  loadAuctionListEntrypoint: LoadAuctionListEntrypoint,
  loadRealmEntrypoint: LoadRealmEntrypoint,
  refreshAuctions: FetchAuctions,
  setCurrentPage: PageChange,
};

export const AuctionsListContainer = connect<
  IStateProps,
  IDispatchProps,
  IOwnProps & IRouteProps,
  IStoreState
>(
  mapStateToProps,
  mapDispatchToProps,
)(AuctionList);
