import { connect } from "react-redux";

import { Data, IStateProps } from "../../components/App/Data";
import { IStoreState } from "../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { currentRegion } = state.Main;
  return { currentRegion };
};

export const DataContainer = connect<IStateProps, {}, {}, IStoreState>(mapStateToProps)(Data);
