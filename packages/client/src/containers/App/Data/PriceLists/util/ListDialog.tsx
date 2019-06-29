import { connect } from "react-redux";

import {
  IStateProps,
  ListDialog,
} from "../../../../../components/App/Data/PriceLists/util/ListDialog";
import { IStoreState } from "../../../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { items } = state.PriceLists;
  return { items };
};

export const ListDialogContainer = connect<IStateProps, {}, {}, IStoreState>(mapStateToProps)(
  ListDialog,
);
