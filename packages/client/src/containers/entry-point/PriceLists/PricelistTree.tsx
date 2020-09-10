import { IItem, IShortItem, ItemId } from "@sotah-inc/core";
import { connect } from "react-redux";

import { FetchGetPricelists } from "../../../actions/price-lists";
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
    pricelists: {
      level: getPricelistsLevel,
      data: { data: pricelists, items: pricelistItems },
    },
    selectedList,
    selectedProfession,
    professionPricelists: {
      level: getProfessionPricelistsLevel,
      data: { data: professionPricelists, items: professionPricelistItems },
    },
    selectedExpansion,
  } = state.PriceLists;

  const { foundItems: items } = [...pricelistItems, ...professionPricelistItems].reduce<{
    itemIds: Set<ItemId>;
    foundItems: IShortItem[];
  }>(
    (result, v) => {
      if (result.itemIds.has(v.id)) {
        return result;
      }

      result.itemIds.add(v.id);

      return {
        foundItems: [...result.foundItems, v],
        itemIds: result.itemIds,
      };
    },
    { itemIds: new Set<ItemId>(), foundItems: [] },
  );

  return {
    authLevel,
    currentRealm,
    currentRegion,
    expansions,
    getPricelistsLevel,
    getProfessionPricelistsLevel,
    items,
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
};

export const PricelistTreeContainer = connect<IStateProps, IDispatchProps, IOwnProps, IStoreState>(
  mapStateToProps,
  mapDispatchToProps,
)(PricelistTree);
