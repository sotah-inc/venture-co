import { connect } from "react-redux";

import { FetchGetPricelist } from "../../../../../../actions/price-lists";
import {
  CurrentPricesTable,
  IDispatchProps,
  IStateProps,
  // tslint:disable-next-line:max-line-length
} from "../../../../../../components/entry-point/PriceLists/PricelistTree/PricelistPanel/PricelistTable/CurrentPricesTable";
import { IStoreState } from "../../../../../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { fetchRealmLevel, currentRealm, currentRegion } = state.Main;
  const { priceTable, selectedList } = state.PriceLists;

  return { fetchRealmLevel, priceTable, currentRealm, currentRegion, selectedList };
}

const mapDispatchToProps: IDispatchProps = {
  getPricelist: FetchGetPricelist,
};

export const CurrentPricesTableContainer = connect<
  IStateProps,
  IDispatchProps,
  Record<string, unknown>,
  IStoreState
>(
  mapStateToProps,
  mapDispatchToProps,
)(CurrentPricesTable);
