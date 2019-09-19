import { connect } from "react-redux";

import { InsertToast } from "../../../actions/oven";
import { FetchUpdateProfile } from "../../../actions/profile";
import {
  IDispatchProps,
  IOwnProps,
  IStateProps,
  ManageAccount,
} from "../../../components/App/Profile/ManageAccount";
import { IStoreState } from "../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { profile } = state.Main;
  const { updateProfileLevel, updateProfileErrors } = state.Profile;

  return {
    token: profile === null ? null : profile.token,
    updateProfileErrors,
    updateProfileLevel,
    user: profile === null ? null : profile.user,
  };
};

const mapDispatchToProps: IDispatchProps = {
  insertToast: InsertToast,
  updateProfile: FetchUpdateProfile,
};

export const ManageAccountContainer = connect<IStateProps, IDispatchProps, IOwnProps, IStoreState>(
  mapStateToProps,
  mapDispatchToProps,
)(ManageAccount);
