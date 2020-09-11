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

    if (
      typeof values.item === "undefined" ||
      values.item === null ||
      typeof values.price === "undefined" ||
      typeof values.quantity === "undefined"
    ) {
      return;
    }

    onSubmit({
      itemId: values.item.id,
      price: Number(values.price.toFixed(0)),
      quantity: values.quantity,
    });
  },
  validationSchema: Yup.object<IFormValues>().shape({
    item: WorkOrderRules.item,
    price: WorkOrderRules.price,
    quantity: WorkOrderRules.quantity,
  }),
};

export const WorkOrderFormFormContainer = withFormik(config)(WorkOrderForm);
