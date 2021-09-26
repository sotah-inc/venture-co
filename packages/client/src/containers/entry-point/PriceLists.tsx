import { connect } from "react-redux";

import { ChangeIsLoginDialogOpen, LoadRealmEntrypoint } from "../../actions/main";
import { LoadPricelistsEntrypoint } from "../../actions/price-lists";
import {
  IDispatchProps,
  IOwnProps,
  IRouteProps,
  IStateProps,
  PriceLists,
} from "../../components/entry-point/PriceLists";
import { IStoreState } from "../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { currentRegion, currentRealm, userData, regionData } = state.Main;
  const {
    selectedProfession: { value: selectedProfession },
    selectedExpansion,
    selectedList,
    professionPricelists: {
      data: { data: professionPricelists },
    },
    pricelists: {
      data: { data: pricelists },
    },
  } = state.PriceLists;

  return {
    currentRealm,
    currentRegion,
    pricelists,
    professionPricelists,
    professions: regionData.data.professions,
    expansions: regionData.data.expansions,
    selectedExpansion,
    selectedList,
    selectedProfession,
    userData,
  };
}

const mapDispatchToProps: IDispatchProps = {
  changeIsLoginDialogOpen: ChangeIsLoginDialogOpen,
  loadPricelistsEntrypoint: LoadPricelistsEntrypoint,
  loadRealmEntrypoint: LoadRealmEntrypoint,
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
