import { connect } from "react-redux";

import { FetchGetUnmetDemand } from "../../../../../actions/price-lists";
import {
  IDispatchProps,
  IOwnProps,
  IStateProps,
  RealmSummaryPanel,
  // tslint:disable-next-line:max-line-length
} from "../../../../../components/entry-point/PriceLists/PricelistTree/TreeContent/RealmSummaryPanel";
import { IStoreState } from "../../../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { expansions, professions } = state.Main;
  const {
    level: getUnmetDemandLevel,
    data: {
      data: { unmetItemIds, professionPricelists: unmetDemandProfessionPricelists },
      items,
    },
  } = state.PriceLists.unmetDemand;
  return {
    expansions,
    getUnmetDemandLevel,
    items,
    professions,
    unmetDemandItemIds: unmetItemIds,
    unmetDemandProfessionPricelists,
  };
};

const mapDispatchToProps: IDispatchProps = {
  refreshUnmetDemand: FetchGetUnmetDemand,
};

export const RealmSummaryPanelContainer = connect<
  IStateProps,
  IDispatchProps,
  IOwnProps,
  IStoreState
>(
  mapStateToProps,
  mapDispatchToProps,
)(RealmSummaryPanel);
