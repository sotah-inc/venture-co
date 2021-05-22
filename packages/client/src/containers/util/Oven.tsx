import { connect } from "react-redux";

import { IStateProps, Oven } from "../../components/util/Oven";
import { IStoreState } from "../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { index, toast } = state.Oven;

  return { index, toast };
}

export const OvenContainer = connect<IStateProps>(mapStateToProps)(Oven);
