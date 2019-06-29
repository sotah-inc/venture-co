import { connect } from "react-redux";

import { FetchGetUnmetDemand, NavigateProfessionNode } from "../../../../../../actions/price-lists";
import {
  IDispatchProps,
  IOwnProps,
  IStateProps,
  RealmSummaryPanel,
  // tslint:disable-next-line:max-line-length
} from "../../../../../../components/App/Data/PriceLists/PricelistTree/TreeContent/RealmSummaryPanel";
import { IStoreState } from "../../../../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { expansions, professions } = state.Main;
  const {
    unmetDemandItemIds,
    unmetDemandProfessionPricelists,
    getUnmetDemandLevel,
    items,
  } = state.PriceLists;
  return {
    expansions,
    getUnmetDemandLevel,
    items,
    professions,
    unmetDemandItemIds,
    unmetDemandProfessionPricelists,
  };
};

const mapDispatchToProps: IDispatchProps = {
  navigateProfessionNode: NavigateProfessionNode,
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
