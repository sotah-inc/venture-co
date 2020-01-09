import { connect } from "react-redux";

import {
  IRouteProps,
  IStateProps,
  UnmetDemand,
} from "../../../../../../components/entry-point/PriceLists/PricelistTree/TreeContent/RealmSummaryPanel/UnmetDemand";
import { IStoreState } from "../../../../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
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
};

export const UnmetDemandContainer = connect<IStateProps, {}, IRouteProps, IStoreState>(
  mapStateToProps,
)(UnmetDemand);
