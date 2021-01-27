import { connect } from "react-redux";

import { BaseAuction, IOwnProps, IStateProps } from "../../components/entry-point/BaseAuction";
import { IStoreState } from "../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { currentRegion } = state.Main;
  return { currentRegion };
};

export const BaseAuctionContainer = connect<IStateProps, {}, IOwnProps, IStoreState>(
  mapStateToProps,
)(BaseAuction);
