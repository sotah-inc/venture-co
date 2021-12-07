import { connect } from "react-redux";

import {
  RelatedProfessionPricelists,
  IStateProps,
} from "../../../../components/entry-point/AuctionList/AuctionTable/RelatedProfessionPricelists";
import { IStoreState } from "../../../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { regionData, currentRealm, currentRegion, currentGameVersion } = state.Main;
  const {
    auctionsResult: { data: auctionsResultData },
  } = state.Auction;

  return {
    auctionsResultData,
    currentRealm,
    currentRegion,
    currentGameVersion,
    professions: regionData.data.professions,
    expansions: regionData.data.expansions,
  };
}

export const RelatedProfessionPricelistsContainer = connect<
  IStateProps,
  Record<string, unknown>,
  Record<string, unknown>,
  IStoreState
>(mapStateToProps)(RelatedProfessionPricelists);
