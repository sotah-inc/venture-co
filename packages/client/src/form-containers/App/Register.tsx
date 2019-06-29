import { withFormik, WithFormikConfig } from "formik";
import * as Yup from "yup";

import { registerUser } from "../../api/user";
import { IFormValues, Register } from "../../components/App/Register";
import { IProfile } from "../../types/global";
import { UserRules } from "../../validator-rules";

interface IFormProps {
  onUserRegister: (payload: IProfile) => void;
  changeIsRegisterDialogOpen: (isOpen: boolean) => void;

  isRegistered: boolean;
  isRegisterDialogOpen: boolean;
}

const config: WithFormikConfig<IFormProps, IFormValues> = {
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
  mapPropsToValues: (_: IFormProps) => {
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
