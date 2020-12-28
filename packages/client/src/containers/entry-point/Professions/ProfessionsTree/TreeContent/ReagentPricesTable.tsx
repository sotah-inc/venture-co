import { connect } from "react-redux";

import {
  IStateProps,
  ReagentPricesTable,
} from "../../../../../components/entry-point/Professions/ProfessionsTree/TreeContent/ReagentPricesTable";
import { IStoreState } from "../../../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { selectedRecipe, priceTable } = state.Professions;

  return {
    priceTable,
    selectedRecipe,
  };
};

export const ReagentPricesTableContainer = connect<IStateProps, {}, {}, IStoreState>(
  mapStateToProps,
)(ReagentPricesTable);
