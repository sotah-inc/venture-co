import { connect } from "react-redux";

import {
  IStateProps,
  RecipePriceHistoriesGraph,
} from "../../../../../components/entry-point/Professions/ProfessionsTree/TreeContent/RecipePriceHistoriesGraph";
import { IStoreState } from "../../../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { recipePriceHistories, selectedRecipe } = state.Professions;

  return { recipePriceHistories, selectedRecipe };
};

export const RecipePriceHistoriesGraphContainer = connect<IStateProps, {}, {}, IStoreState>(
  mapStateToProps,
)(RecipePriceHistoriesGraph);
