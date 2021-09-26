import { connect } from "react-redux";

import {
  IOwnProps,
  IStateProps,
  PricelistProfessionToggle,
} from "../../components/util/PricelistProfessionToggle";
import { IStoreState } from "../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { regionData: { data: { professions } } } = state.Main;
  const {
    selectedProfession: { value: selectedProfession },
  } = state.PriceLists;

  return { professions, selectedProfession };
}

export const PricelistProfessionToggleContainer = connect<
  IStateProps,
  Record<string, unknown>,
  IOwnProps
>(mapStateToProps)(PricelistProfessionToggle);
