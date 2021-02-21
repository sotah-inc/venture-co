import { connect } from "react-redux";

import {
  IStateProps,
  RecipePriceHistoriesGraph,
} from "../../../../../components/entry-point/Professions/ProfessionsTree/TreeContent/RecipePriceHistoriesGraph";
import { IStoreState } from "../../../../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { recipePriceHistories, selectedRecipe } = state.Professions;

  return { recipePriceHistories, selectedRecipe };
}

export const RecipePriceHistoriesGraphContainer = connect<
  IStateProps,
  Record<string, unknown>,
  Record<string, unknown>,
  IStoreState
>(mapStateToProps)(RecipePriceHistoriesGraph);
