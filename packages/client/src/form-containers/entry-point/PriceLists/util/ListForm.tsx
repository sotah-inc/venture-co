import { withFormik, WithFormikConfig } from "formik";
import * as Yup from "yup";

import {
  IFormValues,
  IOwnProps,
  ListForm,
} from "../../../../components/entry-point/PriceLists/util/ListForm";
import { PriceListRules } from "../../../../validator-rules";

const config: WithFormikConfig<IOwnProps, IFormValues> = {
  handleSubmit: async (values, { setSubmitting, props }) => {
    setSubmitting(false);
    props.onComplete(values.name, values.slug);
  },
  mapPropsToValues: (props: IOwnProps) => {
    return {
      name: props.defaultName ? props.defaultName : "",
      slug: props.defaultSlug ? props.defaultSlug : "",
    };
  },
  validationSchema: Yup.object().shape({
    name: PriceListRules.name,
    slug: PriceListRules.slug,
  }),
};

export const ListFormFormContainer = withFormik(config)(ListForm);
