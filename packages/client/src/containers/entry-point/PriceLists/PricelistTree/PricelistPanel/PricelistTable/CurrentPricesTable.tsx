import { connect } from "react-redux";

import { FetchGetPricelist } from "../../../../../../actions/price-lists";
import {
  CurrentPricesTable,
  IDispatchProps,
  IOwnProps,
  IStateProps,
  // tslint:disable-next-line:max-line-length
} from "../../../../../../components/entry-point/PriceLists/PricelistTree/PricelistPanel/PricelistTable/CurrentPricesTable";
import { IStoreState } from "../../../../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { fetchRealmLevel, currentRealm, currentRegion } = state.Main;
  const { priceTable } = state.PriceLists;

  return { fetchRealmLevel, priceTable, currentRealm, currentRegion };
};

const mapDispatchToProps: IDispatchProps = {
  getPricelist: FetchGetPricelist,
};

export const CurrentPricesTableContainer = connect<
  IStateProps,
  IDispatchProps,
  IOwnProps,
  IStoreState
>(
  mapStateToProps,
  mapDispatchToProps,
)(CurrentPricesTable);
