import { connect } from "react-redux";

import {
  IRouteProps,
  IStateProps,
  UnmetDemand,
// eslint-disable-next-line max-len
} from "../../../../../../components/entry-point/PriceLists/PricelistTree/TreeContent/RealmSummaryPanel/UnmetDemand";
import { IStoreState } from "../../../../../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { professions, currentRegion, currentRealm } = state.Main;
  const {
    selectedExpansion,
    unmetDemand: {
      level: getUnmetDemandLevel,
      data: {
        data: { unmetItemIds, professionPricelists: unmetDemandProfessionPricelists },
        items,
      },
    },
  } = state.PriceLists;

  return {
    currentRealm,
    currentRegion,
    getUnmetDemandLevel,
    items,
    professions,
    selectedExpansion,
    unmetDemandItemIds: unmetItemIds,
    unmetDemandProfessionPricelists,
  };
}

export const UnmetDemandContainer = connect<
  IStateProps,
  Record<string, unknown>,
  IRouteProps,
  IStoreState
>(mapStateToProps)(UnmetDemand);
