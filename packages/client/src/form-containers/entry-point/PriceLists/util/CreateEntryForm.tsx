import { withFormik, WithFormikConfig } from "formik";
import * as Yup from "yup";

import {
  CreateEntryForm,
  IFormValues,
  IOwnProps,
} from "../../../../components/entry-point/PriceLists/util/CreateEntryForm";
import { PriceListRules } from "../../../../validator-rules";

const config: WithFormikConfig<IOwnProps, IFormValues> = {
  handleSubmit: async (values, { setSubmitting, resetForm, props }) => {
    if (values.item === null) {
      return;
    }

    setSubmitting(false);
    resetForm();
    props.onComplete(
      { id: -1, item_id: values.item.blizzard_meta.id, quantity_modifier: values.quantity },
      values.item,
    );
  },
  mapPropsToValues: (_: IOwnProps) => {
    return {
      item: null,
      quantity: 1,
    };
  },
  validationSchema: Yup.object().shape({
    item: PriceListRules.item,
    quantity: PriceListRules.quantity,
  }),
};

export const CreateEntryFormFormContainer = withFormik(config)(CreateEntryForm);
