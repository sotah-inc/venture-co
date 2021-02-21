import { withFormik, WithFormikConfig } from "formik";
import * as Yup from "yup";

import { loginUser } from "../../api/user";
import { IDispatchProps, IFormValues, IStateProps, Login } from "../../components/App/Login";
import { UserRules } from "../../validator-rules";

const config: WithFormikConfig<IDispatchProps & IStateProps, IFormValues> = {
  handleSubmit: async (values, { setSubmitting, setErrors, props }) => {
    const { data, errors } = await loginUser(values.email, values.password);
    if (errors !== null || data === null) {
      setErrors(errors ?? {});
      setSubmitting(false);

      return;
    }

    setSubmitting(false);
    props.onUserLogin(data);
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
