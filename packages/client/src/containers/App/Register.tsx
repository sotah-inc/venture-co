import { connect } from "react-redux";

import { ChangeIsRegisterDialogOpen, UserRegister } from "../../actions/main";
import { IDispatchProps, IStateProps } from "../../components/App/Register";
import { RegisterFormContainer } from "../../form-containers/App/Register";
import { IStoreState } from "../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { isRegisterDialogOpen, isRegistered } = state.Main;
  return { isRegisterDialogOpen, isRegistered };
}

const mapDispatchToProps: IDispatchProps = {
  changeIsRegisterDialogOpen: ChangeIsRegisterDialogOpen,
  onUserRegister: UserRegister,
};

export const RegisterContainer = connect<
  IStateProps,
  IDispatchProps,
  Record<string, unknown>,
  IStoreState
>(
  mapStateToProps,
  mapDispatchToProps,
)(RegisterFormContainer);
