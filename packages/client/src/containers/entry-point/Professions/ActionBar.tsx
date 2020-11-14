import { connect } from "react-redux";

import { ActionBar, IStateProps } from "../../../components/entry-point/Professions/ActionBar";
import { IStoreState } from "../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { currentRegion, currentRealm } = state.Main;

  return {
    currentRealm,
    currentRegion,
  };
};

export const ActionBarContainer = connect<IStateProps, {}, {}, IStoreState>(mapStateToProps)(
  ActionBar,
);
