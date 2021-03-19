import { connect } from "react-redux";

import {
  RelatedRecipes,
  IStateProps,
} from "../../../../components/entry-point/AuctionList/AuctionTable/RelatedRecipes";
import { IStoreState } from "../../../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { currentRealm, currentRegion } = state.Main;
  const { itemsRecipes } = state.Auction;

  return {
    itemsRecipes,
    currentRealm,
    currentRegion,
  };
}

export const RelatedRecipesContainer = connect<
  IStateProps,
  Record<string, unknown>,
  Record<string, unknown>,
  IStoreState
>(mapStateToProps)(RelatedRecipes);
