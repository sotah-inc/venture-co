import { connect } from "react-redux";

import {
  IOwnProps,
  IStateProps,
  PricelistTree,
} from "../../../components/entry-point/PriceLists/PricelistTree";
import { IStoreState } from "../../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const {
    currentRealm,
    currentRegion,
    currentGameVersion,
    currentExpansion,
    selectedProfession,
  } = state.Main;
  const { selectedList, professionPricelists } = state.PriceLists;

  return {
    currentGameVersion,
    currentRealm,
    currentRegion,
    professionPricelists,
    selectedExpansion: currentExpansion,
    selectedList,
    selectedProfession,
  };
}

export const PricelistTreeContainer = connect<
  IStateProps,
  Record<string, unknown>,
  IOwnProps,
  IStoreState
>(mapStateToProps)(PricelistTree);
