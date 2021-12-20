import { IExpansion } from "@sotah-inc/core";
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
    currentGameVersion,
    currentRegion,
    currentRealm,
    userData,
    regionData,
    bootData: {
      data: { version_meta },
    },
    currentExpansion,
  } = state.Main;
  const {
    selectedProfession: { value: selectedProfession },
    selectedList,
    professionPricelists: {
      data: { data: professionPricelists },
    },
    pricelists: {
      data: { data: pricelists },
    },
  } = state.PriceLists;

  const expansions = ((): IExpansion[] => {
    if (currentGameVersion === null) {
      return [];
    }

    const foundMeta = version_meta.find(v => v.name === currentGameVersion);
    if (foundMeta === undefined) {
      return [];
    }

    return foundMeta.expansions;
  })();

  return {
    currentGameVersion,
    currentRealm,
    currentRegion,
    pricelists,
    professionPricelists,
    professions: regionData.data.professions,
    expansions,
    selectedExpansion: currentExpansion,
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
