import { connect } from "react-redux";

import {
  IRouteProps,
  IStateProps,
  UnmetDemand,
  // eslint-disable-next-line max-len
} from "../../../../../../components/entry-point/PriceLists/PricelistTree/TreeContent/RealmSummaryPanel/UnmetDemand";
import { IStoreState } from "../../../../../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { regionData, currentRegion, currentRealm } = state.Main;
  const {
    selectedExpansion,
    unmetDemand,
  } = state.PriceLists;

  return {
    regionData,
    currentRealm,
    currentRegion,
    selectedExpansion,
    unmetDemand,
  };
}

export const UnmetDemandContainer = connect<
  IStateProps,
  Record<string, unknown>,
  IRouteProps,
  IStoreState
>(mapStateToProps)(UnmetDemand);
