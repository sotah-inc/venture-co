import { connect } from "react-redux";

import {
  CurrentPricesTable,
  IOwnProps,
  IStateProps,
  // tslint:disable-next-line:max-line-length
} from "../../../../../../components/entry-point/PriceLists/PricelistTree/PricelistPanel/PricelistTable/CurrentPricesTable";
import { IStoreState } from "../../../../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { fetchRealmLevel } = state.Main;
  const {
    priceTable: {
      level: getPricelistLevel,
      data: { data: pricelistMap, items },
    },
  } = state.PriceLists;
  return { fetchRealmLevel, getPricelistLevel, items, pricelistMap };
};

export const CurrentPricesTableContainer = connect<IStateProps, IOwnProps, {}, IStoreState>(
  mapStateToProps,
)(CurrentPricesTable);
