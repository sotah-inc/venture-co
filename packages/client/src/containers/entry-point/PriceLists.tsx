import { IRegionComposite } from "@sotah-inc/core";
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
    selectedProfession: { value: selectedProfession },
    selectedExpansion,
    selectedList,
    professionPricelists: {
      level: getProfessionPricelistsLevel,
      data: { data: professionPricelists },
    },
    pricelists: {
      data: { data: pricelists },
    },
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
    regions: Object.values(regions).reduce<IRegionComposite[]>(
      (result, v) => (v === undefined ? result : [...result, v]),
      [],
    ),
    selectedExpansion,
    selectedList,
    selectedProfession,
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
