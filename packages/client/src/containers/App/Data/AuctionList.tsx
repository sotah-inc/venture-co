import { connect } from "react-redux";

import { FetchAuctions, FetchAuctionsQuery, PageChange } from "../../../actions/auction";
import { FetchGetRealms, RealmChange, RegionChange } from "../../../actions/main";
import { AuctionList, IDispatchProps, IStateProps } from "../../../components/App/Data/AuctionList";
import { IStoreState } from "../../../types";

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
    auctions,
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
  fetchRealms: FetchGetRealms,
  onRealmChange: RealmChange,
  onRegionChange: RegionChange,
  refreshAuctions: FetchAuctions,
  refreshAuctionsQuery: FetchAuctionsQuery,
  setCurrentPage: PageChange,
};

export const AuctionsListContainer = connect<IStateProps, IDispatchProps>(
  mapStateToProps,
  mapDispatchToProps,
)(AuctionList);
