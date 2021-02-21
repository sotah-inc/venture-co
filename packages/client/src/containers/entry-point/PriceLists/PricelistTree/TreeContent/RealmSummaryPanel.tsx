import { connect } from "react-redux";

import {
  IStateProps,
  RealmSummaryPanel,
// eslint-disable-next-line max-len
} from "../../../../../components/entry-point/PriceLists/PricelistTree/TreeContent/RealmSummaryPanel";
import { IStoreState } from "../../../../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { currentRealm, currentRegion } = state.Main;

  return {
    currentRealm,
    currentRegion,
  };
}

export const RealmSummaryPanelContainer = connect<
  IStateProps,
  Record<string, unknown>,
  Record<string, unknown>,
  IStoreState
>(mapStateToProps)(RealmSummaryPanel);
