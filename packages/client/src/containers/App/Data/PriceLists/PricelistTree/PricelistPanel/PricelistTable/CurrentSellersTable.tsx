import { connect } from "react-redux";

import { FetchGetItemsOwnership } from "../../../../../../../actions/price-lists";
import {
  CurrentSellersTable,
  IDispatchProps,
  IOwnProps,
  IStateProps,
  // tslint:disable-next-line:max-line-length
} from "../../../../../../../components/App/Data/PriceLists/PricelistTree/PricelistPanel/PricelistTable/CurrentSellersTable";
import { IStoreState } from "../../../../../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { fetchRealmLevel } = state.Main;
  const { getItemsOwnershipLevel, itemsOwnershipMap } = state.PriceLists;
  return { fetchRealmLevel, getItemsOwnershipLevel, itemsOwnershipMap };
};

const mapDispatchToProps: IDispatchProps = {
  queryOwnersByItems: FetchGetItemsOwnership,
};

export const CurrentSellersTableContainer = connect<
  IStateProps,
  IDispatchProps,
  IOwnProps,
  IStoreState
>(
  mapStateToProps,
  mapDispatchToProps,
)(CurrentSellersTable);
