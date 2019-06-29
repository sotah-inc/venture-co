import { connect } from "react-redux";

import { IStateProps, NewsButton } from "../../../components/App/Topbar/NewsButton";
import { IStoreState } from "../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { profile } = state.Main;
  const user = profile === null ? null : profile.user;

  return { user };
};

export const NewsButtonContainer = connect<IStateProps>(mapStateToProps)(NewsButton);
