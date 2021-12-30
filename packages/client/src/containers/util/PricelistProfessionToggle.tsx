import { connect } from "react-redux";

import {
  IOwnProps,
  IStateProps,
  PricelistProfessionToggle,
} from "../../components/util/PricelistProfessionToggle";
import { IStoreState } from "../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { professions, selectedProfession: { value: selectedProfession } } = state.Main;

  return { professions, selectedProfession };
}

export const PricelistProfessionToggleContainer = connect<
  IStateProps,
  Record<string, unknown>,
  IOwnProps
>(mapStateToProps)(PricelistProfessionToggle);
