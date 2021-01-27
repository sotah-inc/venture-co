import { IRegionComposite } from "@sotah-inc/core";
import { connect } from "react-redux";

import {
  FetchAuctions,
  LoadAuctionListEntrypoint,
  SetCurrentPageQueryAuctions,
} from "../../actions/auction";
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
    fetchUserPreferencesLevel,
    userPreferences,
    fetchRealmLevel,
    realms,
    currentRegion,
    currentRealm,
    authLevel,
    regions,
  } = state.Main;
  const { options, auctionsResult, totalResults, activeSelect } = state.Auction;

  return {
    activeSelect,
    auctionsResult,
    authLevel,
    currentRealm,
    currentRegion,
    fetchRealmLevel,
    fetchUserPreferencesLevel,
    options,
    realms,
    regions: Object.values(regions).reduce<IRegionComposite[]>(
      (result, v) => (v === undefined ? result : [...result, v]),
      [],
    ),
    totalResults,
    userPreferences,
  };
};

const mapDispatchToProps: IDispatchProps = {
  loadAuctionListEntrypoint: LoadAuctionListEntrypoint,
  loadRealmEntrypoint: LoadRealmEntrypoint,
  refreshAuctions: FetchAuctions,
  setCurrentPage: SetCurrentPageQueryAuctions,
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
