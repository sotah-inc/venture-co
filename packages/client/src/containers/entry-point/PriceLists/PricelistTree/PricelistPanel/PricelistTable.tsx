import { connect } from "react-redux";

import { FetchGetItemPriceHistories } from "../../../../../actions/price-lists";
import {
  IDispatchProps,
  IStateProps,
  PricelistTable,
  // tslint:disable-next-line:max-line-length
} from "../../../../../components/entry-point/PriceLists/PricelistTree/PricelistPanel/PricelistTable";
import { IStoreState } from "../../../../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { loadId, itemPriceHistories, selectedList } = state.PriceLists;

  return { loadId, itemPriceHistories, selectedList };
}

export const mapDispatchToProps: IDispatchProps = {
  getItemPriceHistories: FetchGetItemPriceHistories,
};

export const PricelistTableContainer = connect<
  IStateProps,
  IDispatchProps,
  Record<string, unknown>,
  IStoreState
>(
  mapStateToProps,
  mapDispatchToProps,
)(PricelistTable);
