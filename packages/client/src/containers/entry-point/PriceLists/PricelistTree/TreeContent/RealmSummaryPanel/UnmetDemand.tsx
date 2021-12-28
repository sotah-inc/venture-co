import { connect } from "react-redux";

import {
  IRouteProps,
  IStateProps,
  UnmetDemand,
  // eslint-disable-next-line max-len
} from "../../../../../../components/entry-point/PriceLists/PricelistTree/TreeContent/RealmSummaryPanel/UnmetDemand";
import { IStoreState } from "../../../../../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const {
    professions,
    currentGameVersion,
    currentRegion,
    currentRealm,
    currentExpansion,
  } = state.Main;
  const { unmetDemand } = state.PriceLists;

  return {
    professions,
    currentGameVersion,
    currentRealm,
    currentRegion,
    selectedExpansion: currentExpansion,
    unmetDemand,
  };
}

export const UnmetDemandContainer = connect<
  IStateProps,
  Record<string, unknown>,
  IRouteProps,
  IStoreState
>(mapStateToProps)(UnmetDemand);
