import { connect } from "react-redux";
import { FetchGetPricelistHistory } from "../../../../../actions/price-lists";

import {
  IDispatchProps,
  IStateProps,
  PricelistTable,
  // tslint:disable-next-line:max-line-length
} from "../../../../../components/entry-point/PriceLists/PricelistTree/PricelistPanel/PricelistTable";
import { IStoreState } from "../../../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { loadId, pricelistHistory, selectedList } = state.PriceLists;

  return { loadId, pricelistHistory, selectedList };
};

export const mapDispatchToProps: IDispatchProps = {
  getPricelistHistory: FetchGetPricelistHistory,
};

export const PricelistTableContainer = connect<IStateProps, IDispatchProps, {}, IStoreState>(
  mapStateToProps,
  mapDispatchToProps,
)(PricelistTable);
