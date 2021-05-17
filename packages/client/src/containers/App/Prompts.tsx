import { connect } from "react-redux";

import { FetchVerifyUser } from "../../actions/main";
import { IDispatchProps, IStateProps, Prompts } from "../../components/App/Prompts";
import { IStoreState } from "../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { profile, verifyUser } = state.Main;

  return { profile, verifyUser };
}

const mapDispatchToProps: IDispatchProps = {
  fetchVerifyUser: FetchVerifyUser,
};

export const PromptsContainer = connect<
  IStateProps,
  IDispatchProps,
  Record<string, unknown>,
  IStoreState
>(
  mapStateToProps,
  mapDispatchToProps,
)(Prompts);
