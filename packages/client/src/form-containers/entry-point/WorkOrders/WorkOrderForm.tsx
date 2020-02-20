import { withFormik, WithFormikConfig } from "formik";
import * as Yup from "yup";

import {
  IFormValues,
  IOwnProps,
  WorkOrderForm,
} from "../../../components/entry-point/WorkOrders/WorkOrderForm";
import { WorkOrderRules } from "../../../validator-rules";

const config: WithFormikConfig<IOwnProps, IFormValues> = {
  handleSubmit: async (values, { props }) => {
    const { onSubmit } = props;

    if (values.item === null) {
      return;
    }

    onSubmit({ itemId: values.item.id, quantity: values.quantity, price: values.price });
  },
  mapPropsToValues: ({ defaultFormValues }: IOwnProps) => {
    if (typeof defaultFormValues !== "undefined") {
      return defaultFormValues;
    }

    return {
      item: null,
      price: 0,
      quantity: 1,
    };
  },
  validationSchema: Yup.object<IFormValues>().shape({
    item: WorkOrderRules.item,
    price: WorkOrderRules.price,
    quantity: WorkOrderRules.quantity,
  }),
};

export const WorkOrderFormFormContainer = withFormik(config)(WorkOrderForm);
