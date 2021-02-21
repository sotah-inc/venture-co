import { connect } from "react-redux";

import { IOwnProps, IStateProps, Topbar } from "../../components/App/Topbar";
import { IStoreState } from "../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { profile, currentRealm, currentRegion, expansions } = state.Main;
  const { selectedExpansion } = state.PriceLists;

  const user = profile === null ? null : profile.user;

  return { user, currentRealm, currentRegion, expansions, selectedExpansion };
}

export const TopbarContainer = connect<IStateProps, Record<string, unknown>, IOwnProps, IStoreState>(
  mapStateToProps,
)(Topbar);
