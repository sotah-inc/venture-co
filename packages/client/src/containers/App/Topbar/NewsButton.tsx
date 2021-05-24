import { connect } from "react-redux";

import { IStateProps, NewsButton } from "../../../components/App/Topbar/NewsButton";
import { IStoreState } from "../../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { userData } = state.Main;

  return { userData };
}

export const NewsButtonContainer = connect<IStateProps>(mapStateToProps)(NewsButton);
