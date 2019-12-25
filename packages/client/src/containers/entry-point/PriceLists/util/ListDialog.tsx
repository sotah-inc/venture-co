import { connect } from "react-redux";

import {
  IStateProps,
  ListDialog,
} from "../../../../components/entry-point/PriceLists/util/ListDialog";
import { IStoreState } from "../../../../types";

const mapStateToProps = (_state: IStoreState): IStateProps => {
  return { items: {} };
};

export const ListDialogContainer = connect<IStateProps, {}, {}, IStoreState>(mapStateToProps)(
  ListDialog,
);
