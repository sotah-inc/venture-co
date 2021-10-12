import { connect } from "react-redux";

import { LoadBaseEntrypoint } from "../../actions/main";
import {
  BaseEntrypoint,
  IOwnProps,
  IStateProps,
  IDispatchProps,
} from "../../components/entry-point/BaseEntrypoint";
import { IStoreState } from "../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { currentGameVersion } = state.Main;

  return { currentGameVersion };
}

const mapDispatchToProps: IDispatchProps = {
  loadBaseEntrypoint: LoadBaseEntrypoint,
};

export const BaseEntrypointContainer = connect<IStateProps, IDispatchProps, IOwnProps, IStoreState>(
  mapStateToProps,
  mapDispatchToProps,
)(BaseEntrypoint);
