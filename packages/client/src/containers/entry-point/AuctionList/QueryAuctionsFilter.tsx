import { connect } from "react-redux";

import {
  ActiveSelectChange,
  SelectItemQueryAuctions,
  SelectPetQueryAuctions,
} from "../../../actions/auction";
import {
  IDispatchProps,
  IStateProps,
  QueryAuctionsFilter,
} from "../../../components/entry-point/AuctionList/QueryAuctionsFilter";
import { IStoreState } from "../../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { activeSelect, options } = state.Auction;

  return {
    activeSelect,
    queryAuctionsOptions: options,
  };
}

const mapDispatchToProps: IDispatchProps = {
  activeSelectChange: ActiveSelectChange,
  selectItemQueryAuctions: SelectItemQueryAuctions,
  selectPetQueryAuctions: SelectPetQueryAuctions,
};

export const QueryAuctionsFilterContainer = connect<
  IStateProps,
  IDispatchProps,
  Record<string, unknown>,
  IStoreState
>(
  mapStateToProps,
  mapDispatchToProps,
)(QueryAuctionsFilter);
