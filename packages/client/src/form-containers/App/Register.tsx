import { UserLevel } from "@sotah-inc/core";
import { withFormik, WithFormikConfig } from "formik";
import * as Yup from "yup";

import { registerUser } from "../../api/user";
import { signInUserWithCustomToken } from "../../coal";
import { IDispatchProps, IFormValues, IStateProps, Register } from "../../components/App/Register";
import { UserRules } from "../../validator-rules";

const config: WithFormikConfig<IDispatchProps & IStateProps, IFormValues> = {
  handleSubmit: async (values, { setSubmitting, setErrors, props }) => {
    const registerUserResult = await registerUser(values.email, values.password);
    if (registerUserResult.errors !== null) {
      setErrors(registerUserResult.errors);
      setSubmitting(false);

      return;
    }
    if (registerUserResult.data === null) {
      setErrors({ email: "failed to register user" });
      setSubmitting(false);

      return;
    }

    const signInUserResult = await signInUserWithCustomToken(
      props.firebaseBrowserApiKey,
      registerUserResult.data.token,
    );
    if (signInUserResult.errors !== null) {
      setErrors(signInUserResult.errors);
      setSubmitting(false);

      return;
    }
    if (signInUserResult.idToken === null) {
      setErrors({ email: "failed to resolve id token" });
      setSubmitting(false);

      return;
    }

    setSubmitting(false);
    props.onUserRegister({
      token: signInUserResult.idToken,
      user: {
        id: registerUserResult.data.user.id,
        firebaseUid: registerUserResult.data.user.firebaseUid,
        level: UserLevel.Unverified,
        lastClientPathname: null,
        lastClientAsPath: null,
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
