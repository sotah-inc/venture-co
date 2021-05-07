import { connect } from "react-redux";

import {
  IStateProps,
  ReagentPricesTable,
// eslint-disable-next-line max-len
} from "../../../../../components/entry-point/Professions/ProfessionsTree/TreeContent/ReagentPricesTable";
import { IStoreState } from "../../../../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { selectedRecipe, priceTable, itemsVendorPrices } = state.Professions;

  return {
    itemsVendorPrices,
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
