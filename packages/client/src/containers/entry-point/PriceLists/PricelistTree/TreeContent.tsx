import { connect } from "react-redux";

import {
  IStateProps,
  TreeContent,
} from "../../../../components/entry-point/PriceLists/PricelistTree/TreeContent";
import { IStoreState } from "../../../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { currentRealm, currentRegion } = state.Main;
  const { selectedList } = state.PriceLists;
  return { currentRealm, selectedList, currentRegion };
}

export const TreeContentContainer = connect<
  IStateProps,
  Record<string, unknown>,
  Record<string, unknown>,
  IStoreState
>(mapStateToProps)(TreeContent);
