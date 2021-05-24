import { connect } from "react-redux";

import { SelectItemQueryAuctions, SelectPetQueryAuctions } from "../../../actions/auction";
import {
  AuctionTable,
  IDispatchProps,
  IStateProps,
} from "../../../components/entry-point/AuctionList/AuctionTable";
import { IStoreState } from "../../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { currentRealm, currentRegion } = state.Main;
  const {
    relatedProfessionPricelists,
    auctionsResult: { data: auctionsResultData },
    options,
    totalResults,
    itemsRecipes,
  } = state.Auction;

  return {
    auctionsResultData,
    currentRealm,
    currentRegion,
    options,
    relatedProfessionPricelists,
    totalResults,
    itemsRecipes,
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
