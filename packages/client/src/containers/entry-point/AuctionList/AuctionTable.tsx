import { connect } from "react-redux";

import { SelectItemQueryAuctions } from "../../../actions/auction";
import {
  AuctionTable,
  IDispatchProps,
  IStateProps,
} from "../../../components/entry-point/AuctionList/AuctionTable";
import { IStoreState } from "../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { professions, expansions, currentRealm, currentRegion } = state.Main;
  const {
    relatedProfessionPricelists,
    auctionsResult: { data: auctions },
  } = state.Auction;

  return {
    auctions,
    currentRealm,
    currentRegion,
    expansions,
    professions,
    relatedProfessionPricelists,
  };
};

const mapDispatchToProps: IDispatchProps = {
  selectItemQueryAuctions: SelectItemQueryAuctions,
};

export const AuctionTableContainer = connect<IStateProps, IDispatchProps, {}, IStoreState>(
  mapStateToProps,
  mapDispatchToProps,
)(AuctionTable);
