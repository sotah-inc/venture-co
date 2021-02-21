import { connect } from "react-redux";

import { SelectItemQueryAuctions, SelectPetQueryAuctions } from "../../../actions/auction";
import {
  AuctionTable,
  IDispatchProps,
  IStateProps,
} from "../../../components/entry-point/AuctionList/AuctionTable";
import { IStoreState } from "../../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { professions, expansions, currentRealm, currentRegion } = state.Main;
  const {
    relatedProfessionPricelists,
    auctionsResult: { data: auctionsResultData },
    options,
    totalResults,
  } = state.Auction;

  return {
    auctionsResultData,
    currentRealm,
    currentRegion,
    expansions,
    options,
    professions,
    relatedProfessionPricelists,
    totalResults,
  };
}

const mapDispatchToProps: IDispatchProps = {
  selectItemQueryAuctions: SelectItemQueryAuctions,
  selectPetQueryAuctions: SelectPetQueryAuctions,
};

export const AuctionTableContainer = connect<
  IStateProps,
  IDispatchProps,
  Record<string, unknown>,
  IStoreState
>(
  mapStateToProps,
  mapDispatchToProps,
)(AuctionTable);
