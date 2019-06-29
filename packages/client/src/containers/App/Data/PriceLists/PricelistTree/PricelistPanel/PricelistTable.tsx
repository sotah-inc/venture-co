import { connect } from "react-redux";

import {
  IStateProps,
  PricelistTable,
  // tslint:disable-next-line:max-line-length
} from "../../../../../../components/App/Data/PriceLists/PricelistTree/PricelistPanel/PricelistTable";
import { IStoreState } from "../../../../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { items } = state.PriceLists;
  return { items };
};

export const PricelistTableContainer = connect<IStateProps, {}, {}, IStoreState>(mapStateToProps)(
  PricelistTable,
);
