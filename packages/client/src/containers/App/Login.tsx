import { connect } from "react-redux";

import { ChangeIsLoginDialogOpen, FetchUserReload } from "../../actions/main";
import { IDispatchProps, IStateProps } from "../../components/App/Login";
import { LoginFormContainer } from "../../form-containers/App/Login";
import { IStoreState } from "../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const {
    isLoggedIn,
    isLoginDialogOpen,
    firebaseConfig: { browser_api_key },
  } = state.Main;
  return { isLoggedIn, isLoginDialogOpen, firebaseBrowserApiKey: browser_api_key };
}

const mapDispatchToProps: IDispatchProps = {
  changeIsLoginDialogOpen: ChangeIsLoginDialogOpen,
  onUserLogin: FetchUserReload,
};

export const LoginContainer = connect<
  IStateProps,
  IDispatchProps,
  Record<string, unknown>,
  IStoreState
>(
  mapStateToProps,
  mapDispatchToProps,
)(LoginFormContainer);
