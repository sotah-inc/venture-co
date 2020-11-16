import { connect } from "react-redux";

import {
  IOwnProps,
  IStateProps,
  RecipePopover,
} from "../../../../components/entry-point/Professions/ProfessionsTree/RecipePopover";
import { IStoreState } from "../../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { itemClasses } = state.Main;

  return { itemClasses };
};

export const RecipePopoverContainer = connect<IStateProps, IOwnProps>(mapStateToProps)(
  RecipePopover,
);
