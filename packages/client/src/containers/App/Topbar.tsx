import { connect } from "react-redux";

import { IOwnProps, IStateProps, Topbar } from "../../components/App/Topbar";
import { IStoreState } from "../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { profile, currentRealm, currentRegion } = state.Main;
  const user = profile === null ? null : profile.user;

  return { user, currentRealm, currentRegion };
};

export const TopbarContainer = connect<IStateProps, {}, IOwnProps, IStoreState>(mapStateToProps)(
  Topbar,
);
