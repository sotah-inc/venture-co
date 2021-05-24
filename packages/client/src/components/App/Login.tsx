import React from "react";

import { Button, Dialog, Intent } from "@blueprintjs/core";
import { IGetBootResponseData } from "@sotah-inc/core";
import { FormikProps } from "formik";

import { IFetchData, IProfile } from "../../types/global";
import { AuthLevel, UserData } from "../../types/main";
import { DialogActions, DialogBody } from "../util";
import { Generator as FormFieldGenerator } from "../util/FormField";

export interface IStateProps {
  isLoginDialogOpen: boolean;
  userData: UserData;
  bootData: IFetchData<IGetBootResponseData>;
}

export interface IDispatchProps {
  onUserLogin: (profile: IProfile) => void;
  changeIsLoginDialogOpen: (isLoginDialogOpen: boolean) => void;
}

export interface IFormValues {
  email: string;
  password: string;
}

export type Props = Readonly<IStateProps & IDispatchProps & FormikProps<IFormValues>>;

export class Login extends React.Component<Props> {
  public componentDidUpdate(): void {
    const { userData, changeIsLoginDialogOpen } = this.props;

    if (userData.authLevel === AuthLevel.authenticated) {
      changeIsLoginDialogOpen(false);
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
            autofocus: true,
            fieldName: "email",
            getError: () => (errors.email ? errors.email : ""),
            getTouched: () => !!touched.email,
            getValue: () => values.email,
            placeholder: "test@example.com",
            type: "email",
          })}
          {createFormField({
            fieldName: "password",
            getError: () => (errors.password ? errors.password : ""),
            getTouched: () => !!touched.password,
            getValue: () => values.password,
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
            text="Login"
            intent={Intent.PRIMARY}
            icon="edit"
            disabled={isSubmitting}
          />
        </DialogActions>
      </form>
    );
  }

  public render(): React.ReactNode {
    const { isLoginDialogOpen, changeIsLoginDialogOpen } = this.props;

    return (
      <>
        <Button
          onClick={() => changeIsLoginDialogOpen(true)}
          type="button"
          icon="log-in"
          text="Login"
        />
        <Dialog
          isOpen={isLoginDialogOpen}
          onClose={() => changeIsLoginDialogOpen(false)}
          title="Login"
          icon="manually-entered-data"
        >
          {this.renderForm()}
        </Dialog>
      </>
    );
  }
}
