import { connect } from "react-redux";

import { FetchGetPricelists, FetchGetProfessionPricelists } from "../../../actions/price-lists";
import {
  IDispatchProps,
  IOwnProps,
  IStateProps,
  PricelistTree,
} from "../../../components/entry-point/PriceLists/PricelistTree";
import { IStoreState } from "../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { currentRealm, professions, currentRegion, expansions, authLevel, profile } = state.Main;
  const {
    pricelists,
    selectedList,
    selectedProfession,
    getProfessionPricelistsLevel,
    professionPricelists,
    selectedExpansion,
    getPricelistsLevel,
  } = state.PriceLists;

  return {
    authLevel,
    currentRealm,
    currentRegion,
    expansions,
    getPricelistsLevel,
    getProfessionPricelistsLevel,
    pricelists,
    professionPricelists,
    professions,
    profile,
    selectedExpansion,
    selectedList,
    selectedProfession,
  };
};

const mapDispatchToProps: IDispatchProps = {
  refreshPricelists: FetchGetPricelists,
  refreshProfessionPricelists: FetchGetProfessionPricelists,
};

export const PricelistTreeContainer = connect<IStateProps, IDispatchProps, IOwnProps, IStoreState>(
  mapStateToProps,
  mapDispatchToProps,
)(PricelistTree);
