import React from "react";

import { Button, Dialog, Intent } from "@blueprintjs/core";
import { IGetBootResponseData } from "@sotah-inc/core";
import { FormikProps } from "formik";

import { IFetchData, IProfile } from "../../types/global";
import { AuthLevel, UserData } from "../../types/main";
import { DialogActions, DialogBody } from "../util";
import { Generator as FormFieldGenerator } from "../util/FormField";

export interface IStateProps {
  userData: UserData;
  isRegisterDialogOpen: boolean;
  bootData: IFetchData<IGetBootResponseData>;
}

export interface IDispatchProps {
  onUserRegister: (payload: IProfile) => void;
  changeIsRegisterDialogOpen: (isOpen: boolean) => void;
}

export interface IFormValues {
  email: string;
  password: string;
}

export type Props = Readonly<IStateProps & IDispatchProps & FormikProps<IFormValues>>;

export class Register extends React.Component<Props> {
  public componentDidUpdate(): void {
    const { userData, changeIsRegisterDialogOpen } = this.props;

    if (userData.authLevel === AuthLevel.authenticated) {
      changeIsRegisterDialogOpen(false);
    }
  }

  public renderForm(): JSX.Element {
    const {
      values,
      setFieldValue,
      isSubmitting,
      handleReset,
      handleSubmit,
      dirty,
      errors,
      touched,
    } = this.props;
    const createFormField = FormFieldGenerator({ setFieldValue });

    return (
      <form onSubmit={handleSubmit}>
        <DialogBody>
          {createFormField({
            fieldName: "email",
            getError: () => (errors.email ? errors.email : ""),
            getTouched: () => !!touched.email,
            getValue: () => values.email,
            helperText: "For communication",
            placeholder: "test@example.com",
            type: "email",
          })}
          {createFormField({
            fieldName: "password",
            getError: () => (errors.password ? errors.password : ""),
            getTouched: () => !!touched.password,
            getValue: () => values.password,
            helperText: "For login",
            type: "password",
          })}
        </DialogBody>
        <DialogActions>
          <Button
            text="Reset"
            intent={Intent.NONE}
            onClick={handleReset}
            disabled={!dirty || isSubmitting}
          />
          <Button
            type="submit"
            text="Register"
            intent={Intent.PRIMARY}
            icon="edit"
            disabled={isSubmitting}
          />
        </DialogActions>
      </form>
    );
  }

  public render(): React.ReactNode {
    const { isRegisterDialogOpen, changeIsRegisterDialogOpen } = this.props;

    return (
      <>
        <Button
          onClick={() => changeIsRegisterDialogOpen(!isRegisterDialogOpen)}
          text="Register"
          icon="user"
        />
        <Dialog
          isOpen={isRegisterDialogOpen}
          onClose={() => changeIsRegisterDialogOpen(!isRegisterDialogOpen)}
          title="Register"
          icon="manually-entered-data"
        >
          {this.renderForm()}
        </Dialog>
      </>
    );
  }
}
