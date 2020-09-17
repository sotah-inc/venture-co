import { connect } from "react-redux";

import {
  IStateProps,
  ListDialog,
} from "../../../../components/entry-point/PriceLists/util/ListDialog";
import { IStoreState } from "../../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  return { items: [...state.PriceLists.priceTable.data.items] };
};

export const ListDialogContainer = connect<IStateProps, {}, {}, IStoreState>(mapStateToProps)(
  ListDialog,
);
