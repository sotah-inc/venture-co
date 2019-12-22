import { connect } from "react-redux";

import { AddAuctionsQuery, RemoveAuctionsQuery } from "../../../actions/auction";
import {
  AuctionTable,
  IDispatchProps,
  IStateProps,
} from "../../../components/entry-point/AuctionList/AuctionTable";
import { IStoreState } from "../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { professions, expansions, currentRealm, currentRegion } = state.Main;
  const { auctions, selectedQueryAuctionResults, relatedProfessionPricelists } = state.Auction;

  return {
    auctions,
    currentRealm,
    currentRegion,
    expansions,
    professions,
    relatedProfessionPricelists,
    selectedItems: selectedQueryAuctionResults,
  };
};

const mapDispatchToProps: IDispatchProps = {
  onAuctionsQueryDeselect: RemoveAuctionsQuery,
  onAuctionsQuerySelect: AddAuctionsQuery,
};

export const AuctionTableContainer = connect<IStateProps, IDispatchProps, {}, IStoreState>(
  mapStateToProps,
  mapDispatchToProps,
)(AuctionTable);
