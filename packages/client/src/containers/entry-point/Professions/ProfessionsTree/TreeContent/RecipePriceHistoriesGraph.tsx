import { connect } from "react-redux";

import {
  IStateProps,
  RecipePriceHistoriesGraph,
} from "../../../../../components/entry-point/Professions/ProfessionsTree/TreeContent/RecipePriceHistoriesGraph";

import { IStoreState } from "../../../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { recipePriceHistories } = state.Professions;

  return { recipePriceHistories };
};

export const RecipePriceHistoriesGraphContainer = connect<IStateProps, {}, {}, IStoreState>(
  mapStateToProps,
)(RecipePriceHistoriesGraph);
