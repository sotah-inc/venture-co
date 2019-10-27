import { connect } from "react-redux";

import { LoadRootEntrypoint } from "../../actions/main";
import { Content, IDispatchProps, IOwnProps } from "../../components/entry-point/Content";
import { IStoreState } from "../../types";

const mapStateToProps = (_state: IStoreState): void => {
  return;
};

const mapDispatchToProps: IDispatchProps = {
  loadRootEntrypoint: LoadRootEntrypoint,
};

export const ContentContainer = connect<void, IDispatchProps, IOwnProps>(
  mapStateToProps,
  mapDispatchToProps,
)(Content);
