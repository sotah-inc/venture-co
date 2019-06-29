import { withFormik, WithFormikConfig } from "formik";
import * as Yup from "yup";

import { registerUser } from "../../api/user";
import { IDispatchProps, IFormValues, IStateProps, Register } from "../../components/App/Register";
import { UserRules } from "../../validator-rules";

const config: WithFormikConfig<IDispatchProps & IStateProps, IFormValues> = {
  handleSubmit: async (values, { setSubmitting, setErrors, props }) => {
    const { data, errors } = await registerUser(values.email, values.password);
    if (errors !== null) {
      setErrors(errors);
      setSubmitting(false);

      return;
    }

    setSubmitting(false);
    props.onUserRegister(data!);
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
