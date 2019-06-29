import { connect } from "react-redux";

import { ChangeIsLoginDialogOpen, UserLogin } from "../../actions/main";
import { IDispatchProps, IStateProps } from "../../components/App/Login";
import { LoginFormContainer } from "../../form-containers/App/Login";
import { IStoreState } from "../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { isLoggedIn, isLoginDialogOpen } = state.Main;
  return { isLoggedIn, isLoginDialogOpen };
};

const mapDispatchToProps: IDispatchProps = {
  changeIsLoginDialogOpen: ChangeIsLoginDialogOpen,
  onUserLogin: UserLogin,
};

export const LoginContainer = connect<IStateProps, IDispatchProps>(
  mapStateToProps,
  mapDispatchToProps,
)(LoginFormContainer);
