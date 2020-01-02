import { connect } from "react-redux";

import {
  IStateProps,
  RealmSummaryPanel,
} from "../../../../../components/entry-point/PriceLists/PricelistTree/TreeContent/RealmSummaryPanel";
import { IStoreState } from "../../../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { currentRealm, currentRegion } = state.Main;

  return {
    currentRealm,
    currentRegion,
  };
};

export const RealmSummaryPanelContainer = connect<IStateProps, {}, {}, IStoreState>(
  mapStateToProps,
)(RealmSummaryPanel);
