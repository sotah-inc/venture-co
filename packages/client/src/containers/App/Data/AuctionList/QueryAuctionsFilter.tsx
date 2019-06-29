import { connect } from "react-redux";

import {
  ActiveSelectChange,
  AddAuctionsQuery,
  FetchAuctionsQuery,
  RefreshAuctionsQuery,
  RemoveAuctionsQuery,
} from "../../../../actions/auction";
import {
  IDispatchProps,
  IStateProps,
  QueryAuctionsFilter,
} from "../../../../components/App/Data/AuctionList/QueryAuctionsFilter";
import { IStoreState } from "../../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { currentRegion, currentRealm } = state.Main;
  const {
    queryAuctionsLevel,
    queryAuctionResults,
    selectedQueryAuctionResults,
    activeSelect,
  } = state.Auction;
  return {
    activeSelect,
    currentRealm,
    currentRegion,
    items: queryAuctionResults,
    queryAuctionsLevel,
    selectedItems: selectedQueryAuctionResults,
  };
};

const mapDispatchToProps: IDispatchProps = {
  activeSelectChange: ActiveSelectChange,
  fetchAuctionsQuery: FetchAuctionsQuery,
  onAuctionsQueryDeselect: RemoveAuctionsQuery,
  onAuctionsQuerySelect: AddAuctionsQuery,
  refreshAuctionsQuery: RefreshAuctionsQuery,
};

export const QueryAuctionsFilterContainer = connect<IStateProps, IDispatchProps>(
  mapStateToProps,
  mapDispatchToProps,
)(QueryAuctionsFilter);
