import { connect } from "react-redux";

import { ChangeIsLoginDialogOpen, LoadRealmEntrypoint } from "../../actions/main";
import {
  ChangeSelectedExpansion,
  ChangeSelectedList,
  LoadPricelistsEntrypoint,
  ResetProfessionsSelections,
} from "../../actions/price-lists";
import {
  IDispatchProps,
  IOwnProps,
  IRouteProps,
  IStateProps,
  PriceLists,
} from "../../components/entry-point/PriceLists";
import { IStoreState } from "../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const {
    currentRegion,
    currentRealm,
    authLevel,
    fetchRealmLevel,
    regions,
    realms,
    professions,
    expansions,
  } = state.Main;
  const {
    selectedProfession,
    selectedExpansion,
    getProfessionPricelistsLevel,
    selectedList,
    professionPricelists,
    pricelists,
  } = state.PriceLists;

  return {
    authLevel,
    currentRealm,
    currentRegion,
    expansions,
    fetchRealmLevel,
    getProfessionPricelistsLevel,
    pricelists,
    professionPricelists,
    professions,
    realms,
    regions,
    selectedExpansion,
    selectedList,
    selectedProfession,
  };
};

const mapDispatchToProps: IDispatchProps = {
  changeIsLoginDialogOpen: ChangeIsLoginDialogOpen,
  changeSelectedExpansion: ChangeSelectedExpansion,
  changeSelectedList: ChangeSelectedList,
  loadPricelistsEntrypoint: LoadPricelistsEntrypoint,
  loadRealmEntrypoint: LoadRealmEntrypoint,
  resetProfessionsSelections: ResetProfessionsSelections,
};

export const PriceListsContainer = connect<
  IStateProps,
  IDispatchProps,
  IOwnProps & IRouteProps,
  IStoreState
>(
  mapStateToProps,
  mapDispatchToProps,
)(PriceLists);
