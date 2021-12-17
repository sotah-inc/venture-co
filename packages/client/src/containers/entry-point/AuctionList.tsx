import { FeatureFlag } from "@sotah-inc/core/build/dist/types/contracts/data";
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

function mapStateToProps(state: IStoreState): IStateProps {
  const { realms, currentRegion, currentRealm, bootData, currentGameVersion } = state.Main;
  const { options, auctionsResult, totalResults, activeSelect } = state.Auction;

  const featureFlags = ((): FeatureFlag[] => {
    if (currentGameVersion === null) {
      return [];
    }

    const foundMeta = bootData.data.version_meta.find(v => v.name === currentGameVersion);
    if (foundMeta === undefined) {
      return [];
    }

    return foundMeta.feature_flags;
  })();

  return {
    activeSelect,
    auctionsResult,
    regions: bootData.data.regions,
    featureFlags,
    gameVersions: bootData.data.version_meta.map(v => v.name),
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
