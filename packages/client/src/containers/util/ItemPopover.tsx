import { connect } from "react-redux";

import { IOwnProps, IStateProps, ItemPopover } from "../../components/util/ItemPopover";
import { IStoreState } from "../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { itemClasses } = state.Main;
  return { itemClasses };
}

export const ItemPopoverContainer = connect<IStateProps, IOwnProps>(mapStateToProps)(ItemPopover);
