import { withFormik, WithFormikConfig } from "formik";
import * as Yup from "yup";

import {
  BulkEntryForm,
  IFormValues,
  IOwnProps,
} from "../../../../../components/App/Data/PriceLists/util/BulkEntryForm";
import { PriceListRules } from "../../../../../validator-rules";

const config: WithFormikConfig<IOwnProps, IFormValues> = {
  handleSubmit: async (_values, { setSubmitting, resetForm, props }) => {
    setSubmitting(false);
    resetForm();
    props.onComplete();
  },
  mapPropsToValues: (_: IOwnProps) => {
    return {
      item: null,
      quantity: 1,
    };
  },
  validationSchema: Yup.object().shape({
    item: PriceListRules.item.notRequired(),
    quantity: PriceListRules.quantity,
  }),
};

export const BulkEntryFormFormContainer = withFormik(config)(BulkEntryForm);
