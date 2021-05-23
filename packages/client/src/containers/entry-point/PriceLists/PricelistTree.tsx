import { connect } from "react-redux";

import {
  IOwnProps,
  IStateProps,
  PricelistTree,
} from "../../../components/entry-point/PriceLists/PricelistTree";
import { IStoreState } from "../../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { currentRealm, currentRegion } = state.Main;
  const {
    selectedExpansion,
    selectedProfession,
    selectedList,
    professionPricelists,
  } = state.PriceLists;

  return {
    currentRealm,
    currentRegion,
    professionPricelists,
    selectedExpansion,
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
