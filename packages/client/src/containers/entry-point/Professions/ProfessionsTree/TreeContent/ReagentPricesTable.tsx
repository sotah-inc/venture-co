import { connect } from "react-redux";

import {
  IStateProps,
  ReagentPricesTable,
// eslint-disable-next-line max-len
} from "../../../../../components/entry-point/Professions/ProfessionsTree/TreeContent/ReagentPricesTable";
import { IStoreState } from "../../../../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { selectedRecipe, priceTable } = state.Professions;

  return {
    priceTable,
    selectedRecipe,
  };
}

export const ReagentPricesTableContainer = connect<
  IStateProps,
  Record<string, unknown>,
  Record<string, unknown>,
  IStoreState
>(mapStateToProps)(ReagentPricesTable);
