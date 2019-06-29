import { connect } from "react-redux";

import { IOwnProps, IStateProps, PricelistIcon } from "../../components/util/PricelistIcon";
import { IStoreState } from "../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { items: auctionItems } = state.Auction;
  const { items: pricelistItems } = state.PriceLists;

  return { items: { ...auctionItems, ...pricelistItems } };
};

export const PricelistIconContainer = connect<IStateProps, IOwnProps>(mapStateToProps)(
  PricelistIcon,
);
