import { connect } from "react-redux";

import {
  RelatedProfessionPricelists,
  IStateProps,
} from "../../../../components/entry-point/AuctionList/AuctionTable/RelatedProfessionPricelists";
import { IStoreState } from "../../../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { professions, expansions, currentRealm, currentRegion } = state.Main;
  const {
    auctionsResult: { data: auctionsResultData },
  } = state.Auction;

  return {
    auctionsResultData,
    currentRealm,
    currentRegion,
    expansions,
    professions,
  };
}

export const RelatedProfessionPricelistsContainer = connect<
  IStateProps,
  {},
  Record<string, unknown>,
  IStoreState
>(mapStateToProps)(RelatedProfessionPricelists);
