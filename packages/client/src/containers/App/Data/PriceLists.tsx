import { connect } from "react-redux";

import {
  ChangeIsLoginDialogOpen,
  FetchGetRealms,
  RealmChange,
  RegionChange,
} from "../../../actions/main";
import {
  ChangeSelectedExpansion,
  ChangeSelectedList,
  ChangeSelectedProfession,
  ResetProfessionsSelections,
} from "../../../actions/price-lists";
import { IDispatchProps, IStateProps, PriceLists } from "../../../components/App/Data/PriceLists";
import { IStoreState } from "../../../types";

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
  changeSelectedProfession: ChangeSelectedProfession,
  fetchRealms: FetchGetRealms,
  onRealmChange: RealmChange,
  onRegionChange: RegionChange,
  resetProfessionsSelections: ResetProfessionsSelections,
};

export const PriceListsContainer = connect<IStateProps, IDispatchProps>(
  mapStateToProps,
  mapDispatchToProps,
)(PriceLists);
