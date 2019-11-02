import { withFormik, WithFormikConfig } from "formik";
import * as Yup from "yup";

import { IFormValues, IOwnProps, PostForm } from "../../../components/entry-point/News/PostForm";
import { PostRules } from "../../../validator-rules";

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
      body: "",
      slug: "",
      summary: "",
      title: "",
    };
  },
  validationSchema: Yup.object().shape({
    body: PostRules.body,
    slug: PostRules.slug,
    summary: PostRules.summary,
    title: PostRules.title,
  }),
};

export const PostFormFormContainer = withFormik(config)(PostForm);
