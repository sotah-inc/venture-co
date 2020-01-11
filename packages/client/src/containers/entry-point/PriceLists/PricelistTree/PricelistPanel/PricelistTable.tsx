import { connect } from "react-redux";

import {
  IStateProps,
  PricelistTable,
  // tslint:disable-next-line:max-line-length
} from "../../../../../components/entry-point/PriceLists/PricelistTree/PricelistPanel/PricelistTable";
import { IStoreState } from "../../../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const {
    loadId,
    pricelistHistory: {
      data: {
        data: { history: pricelistHistoryMap, overallPriceLimits },
        items,
      },
    },
  } = state.PriceLists;

  return { items, loadId, pricelistHistoryMap, overallPriceLimits };
};

export const PricelistTableContainer = connect<IStateProps, {}, {}, IStoreState>(mapStateToProps)(
  PricelistTable,
);
