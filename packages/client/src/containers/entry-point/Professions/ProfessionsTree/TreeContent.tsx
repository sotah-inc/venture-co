import { connect } from "react-redux";

import {
  IStateProps,
  TreeContent,
} from "../../../../components/entry-point/Professions/ProfessionsTree/TreeContent";
import { IStoreState } from "../../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { selectedRecipe } = state.Professions;

  return {
    selectedRecipe,
  };
};

export const TreeContentContainer = connect<IStateProps, {}, {}, IStoreState>(mapStateToProps)(
  TreeContent,
);
