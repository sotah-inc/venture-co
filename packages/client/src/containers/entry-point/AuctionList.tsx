import { connect } from "react-redux";

import {
  FetchAuctions,
  LoadAuctionListEntrypoint,
  SetCurrentPageQueryAuctions,
} from "../../actions/auction";
import { LoadRealmEntrypoint, SetVersionToggleConfig } from "../../actions/main";
import {
  AuctionList,
  IDispatchProps,
  IOwnProps,
  IRouteProps,
  IStateProps,
} from "../../components/entry-point/AuctionList";
import { IStoreState } from "../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { realms, currentRegion, currentRealm, bootData, currentGameVersion } = state.Main;
  const { options, auctionsResult, totalResults, activeSelect } = state.Auction;

  return {
    activeSelect,
    auctionsResult,
    regions: bootData.data.regions,
    featureFlags: bootData.data.feature_flags,
    gameVersions: bootData.data.game_versions,
    currentGameVersion,
    currentRealm,
    currentRegion,
    options,
    realms,
    totalResults,
  };
}

const mapDispatchToProps: IDispatchProps = {
  loadAuctionListEntrypoint: LoadAuctionListEntrypoint,
  loadRealmEntrypoint: LoadRealmEntrypoint,
  refreshAuctions: FetchAuctions,
  setCurrentPage: SetCurrentPageQueryAuctions,
  setVersionToggleConfig: SetVersionToggleConfig,
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
