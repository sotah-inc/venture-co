import { withFormik, WithFormikConfig } from "formik";
import * as Yup from "yup";

import {
  IFormValues,
  IOwnProps,
  ManageAccountForm,
} from "../../../components/App/Profile/ManageAccountForm";
import { ManageAccountRules } from "../../../validator-rules";

const config: WithFormikConfig<IOwnProps, IFormValues> = {
  handleSubmit: async (values, { props }) => {
    const { onSubmit } = props;

    onSubmit(values);
  },
  mapPropsToValues: ({ defaultFormValues }: IOwnProps) => {
    if (typeof defaultFormValues !== "undefined") {
      return defaultFormValues;
    }

    return {
      email: "",
    };
  },
  validationSchema: Yup.object().shape({
    email: ManageAccountRules.email,
  }),
};

export const ManageAccountFormFormContainer = withFormik(config)(ManageAccountForm);
