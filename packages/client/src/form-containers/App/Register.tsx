import { UserLevel } from "@sotah-inc/core";
import { withFormik, WithFormikConfig } from "formik";
import * as Yup from "yup";

import { registerUser } from "../../coal";
import { IDispatchProps, IFormValues, IStateProps, Register } from "../../components/App/Register";
import { UserRules } from "../../validator-rules";

const config: WithFormikConfig<IDispatchProps & IStateProps, IFormValues> = {
  handleSubmit: async (values, { setSubmitting, setErrors, props }) => {
    const registerUserResult = await registerUser(props.firebaseBrowserApiKey, values);
    if (registerUserResult.errors !== null) {
      setErrors(registerUserResult.errors);
      setSubmitting(false);

      return;
    }

    if (registerUserResult.userId === null) {
      setErrors({ email: "failed to register user" });
      setSubmitting(false);

      return;
    }

    setSubmitting(false);
    props.onUserRegister({
      token: "",
      user: {
        email: values.email,
        id: -1,
        level: UserLevel.Unverified,
      },
    });
  },
  mapPropsToValues: (_: IDispatchProps & IStateProps) => {
    return {
      email: "",
      password: "",
    };
  },
  validationSchema: Yup.object().shape({
    email: UserRules.email,
    password: UserRules.password,
  }),
};

export const RegisterFormContainer = withFormik(config)(Register);
