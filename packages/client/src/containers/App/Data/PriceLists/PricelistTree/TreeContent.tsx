import { connect } from "react-redux";

import {
  IStateProps,
  TreeContent,
} from "../../../../../components/App/Data/PriceLists/PricelistTree/TreeContent";
import { IStoreState } from "../../../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { currentRealm, currentRegion } = state.Main;
  const { selectedList } = state.PriceLists;
  return { currentRealm, selectedList, currentRegion };
};

export const TreeContentContainer = connect<IStateProps>(mapStateToProps)(TreeContent);
