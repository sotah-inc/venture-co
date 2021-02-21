import { connect } from "react-redux";

import {
  IStateProps,
  TreeContent,
} from "../../../../components/entry-point/Professions/ProfessionsTree/TreeContent";
import { IStoreState } from "../../../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { selectedRecipe, selectedRecipeId } = state.Professions;

  return {
    selectedRecipe,
    selectedRecipeId,
  };
}

export const TreeContentContainer = connect<
  IStateProps,
  Record<string, unknown>,
  Record<string, unknown>,
  IStoreState
>(mapStateToProps)(TreeContent);
