import { connect } from "react-redux";

import {
  IOwnProps,
  IStateProps,
  PricelistTree,
} from "../../../components/entry-point/PriceLists/PricelistTree";
import { IStoreState } from "../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { currentRealm, professions, currentRegion, expansions } = state.Main;
  const {
    selectedExpansion,
    selectedProfession,
    selectedList,
    professionPricelists,
  } = state.PriceLists;

  return {
    currentRealm,
    currentRegion,
    expansions,
    professionPricelists,
    professions,
    selectedExpansion,
    selectedList,
    selectedProfession,
  };
};

export const PricelistTreeContainer = connect<IStateProps, {}, IOwnProps, IStoreState>(
  mapStateToProps,
)(PricelistTree);
