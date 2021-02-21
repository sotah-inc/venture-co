import { connect } from "react-redux";

import { IDispatchProps, IStateProps, Prompts } from "../../components/App/Prompts";
import { IStoreState } from "../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { profile } = state.Main;
  const user = profile === null ? null : profile.user;

  return { user };
}

const mapDispatchToProps: IDispatchProps = {
  hello: () => {
    return;
  },
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
