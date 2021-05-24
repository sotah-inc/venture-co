import { connect } from "react-redux";

import {
  IStateProps,
  RecipePriceHistoriesGraph,
  // eslint-disable-next-line max-len
} from "../../../../../components/entry-point/Professions/ProfessionsTree/TreeContent/RecipePriceHistoriesGraph";
import { IStoreState } from "../../../../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { recipePriceHistories, selectedRecipe, itemsVendorPrices } = state.Professions;

  return { recipePriceHistories, selectedRecipe, itemsVendorPrices };
}

export const RecipePriceHistoriesGraphContainer = connect<
  IStateProps,
  Record<string, unknown>,
  Record<string, unknown>,
  IStoreState
>(mapStateToProps)(RecipePriceHistoriesGraph);
