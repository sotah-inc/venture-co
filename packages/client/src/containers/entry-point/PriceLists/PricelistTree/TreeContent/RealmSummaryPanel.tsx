import { connect } from "react-redux";

import {
  IOwnProps,
  IStateProps,
  RealmSummaryPanel,
  // tslint:disable-next-line:max-line-length
} from "../../../../../components/entry-point/PriceLists/PricelistTree/TreeContent/RealmSummaryPanel";
import { IStoreState } from "../../../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { professions } = state.Main;
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
    getUnmetDemandLevel,
    items,
    professions,
    selectedExpansion,
    unmetDemandItemIds: unmetItemIds,
    unmetDemandProfessionPricelists,
  };
};

export const RealmSummaryPanelContainer = connect<IStateProps, {}, IOwnProps, IStoreState>(
  mapStateToProps,
)(RealmSummaryPanel);
