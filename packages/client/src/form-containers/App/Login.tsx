import { withFormik, WithFormikConfig } from "formik";
import * as Yup from "yup";

import { signInWithEmailAndPassword } from "../../coal/auth/sign-in-with-email-and-password";
import { IDispatchProps, IFormValues, IStateProps, Login } from "../../components/App/Login";
import { UserRules } from "../../validator-rules";

const config: WithFormikConfig<IDispatchProps & IStateProps, IFormValues> = {
  handleSubmit: async (values, { setSubmitting, setErrors, props }) => {
    const { token, errors } = await signInWithEmailAndPassword(props.firebaseBrowserApiKey, values);
    if (errors !== null) {
      setErrors(errors);
      setSubmitting(false);

      return;
    }

    if (token === null) {
      setErrors({ email: "failed to log in" });
      setSubmitting(false);

      return;
    }

    setSubmitting(false);
    props.onUserLogin(token);
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

export const LoginFormContainer = withFormik(config)(Login);
