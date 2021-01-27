import { connect } from "react-redux";

import { BaseAuctions, IOwnProps, IStateProps } from "../../components/entry-point/BaseAuctions";
import { IStoreState } from "../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { currentRegion } = state.Main;
  return { currentRegion };
};

export const BaseAuctionsContainer = connect<IStateProps, {}, IOwnProps, IStoreState>(
  mapStateToProps,
)(BaseAuctions);
