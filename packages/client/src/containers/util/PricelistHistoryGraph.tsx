import { connect } from "react-redux";

import { FetchGetPricelistHistory } from "../../actions/price-lists";
import {
  IDispatchProps,
  IOwnProps,
  IStateProps,
  PricelistHistoryGraph,
} from "../../components/util/PricelistHistoryGraph";
import { IStoreState } from "../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const {
    items: pricelistsItems,
    getPricelistHistoryLevel,
    pricelistHistoryMap,
    itemsPriceLimits,
    overallPriceLimits,
  } = state.PriceLists;

  const { items: auctionItems } = state.Auction;

  return {
    getPricelistHistoryLevel,
    items: { ...pricelistsItems, ...auctionItems },
    itemsPriceLimits,
    overallPriceLimits,
    pricelistHistoryMap,
  };
};

const mapDispatchToProps = {
  reloadPricelistHistory: FetchGetPricelistHistory,
};

export const PricelistHistoryGraphContainer = connect<IStateProps, IDispatchProps, IOwnProps>(
  mapStateToProps,
  mapDispatchToProps,
)(PricelistHistoryGraph);
