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

function mapStateToProps(state: IStoreState): IStateProps {
  const { userData } = state.Main;
  const { updateProfileLevel, updateProfileErrors } = state.Profile;

  return {
    userData,
    updateProfileErrors,
    updateProfileLevel,
  };
}

const mapDispatchToProps: IDispatchProps = {
  insertToast: InsertToast,
  updateProfile: FetchUpdateProfile,
};

export const ManageAccountContainer = connect<IStateProps, IDispatchProps, IOwnProps, IStoreState>(
  mapStateToProps,
  mapDispatchToProps,
)(ManageAccount);
