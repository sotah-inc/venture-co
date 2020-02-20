import React from "react";

import { Button, FormGroup, H5, Intent } from "@blueprintjs/core";
import { ICreateWorkOrderRequest, IItem } from "@sotah-inc/core";
import { FormikProps } from "formik";

import { Generator as FormFieldGenerator } from "../../../components/util/FormField";
import { FetchLevel } from "../../../types/main";
import { getItemIconUrl, getItemTextValue, qualityToColorClass } from "../../../util";
import { DialogActions, DialogBody, ItemInput } from "../../util";

export interface IOwnProps {
  onSubmit: (req: ICreateWorkOrderRequest) => void;
  onComplete: () => void;
  onFatalError: (v: string) => void;
  defaultFormValues?: IFormValues;
  mutateOrderLevel: FetchLevel;
  mutateOrderErrors: {
    [key: string]: string;
  };
  isSubmitDisabled: boolean;
}

export interface IFormValues {
  price: number;
  quantity: number;
  item: IItem | null;
}

export type Props = Readonly<IOwnProps & FormikProps<IFormValues>>;

export class WorkOrderForm extends React.Component<Props> {
  private static renderSelectedItem(item: IItem | null) {
    if (item === null) {
      return (
        <p>
          <em>No item selected.</em>
        </p>
      );
    }

    const className = qualityToColorClass(item.quality);
    const textValue = getItemTextValue(item);
    const itemIcon = getItemIconUrl(item);
    if (itemIcon === null) {
      return <p className={className}>{textValue}</p>;
    }

    return (
      <H5 className={`${className} new-entry-item`}>
        <img src={itemIcon} alt={""} /> {textValue}
      </H5>
    );
  }

  public componentDidUpdate(_prevProps: Props): void {
    const {
      mutateOrderErrors,
      mutateOrderLevel,
      onComplete,
      setSubmitting,
      handleReset,
      onFatalError,
    } = this.props;

    switch (mutateOrderLevel) {
      case FetchLevel.success:
        setSubmitting(false);
        handleReset();
        onComplete();

        return;
      case FetchLevel.failure:
        setSubmitting(false);
        if ("error" in mutateOrderErrors) {
          onFatalError(mutateOrderErrors.error);
        }

        return;
      default:
        return;
    }
  }

  public render() {
    const {
      values,
      setFieldValue,
      isSubmitting,
      handleReset,
      handleSubmit,
      dirty,
      errors,
      touched,
      children,
      mutateOrderErrors,
      isSubmitDisabled,
    } = this.props;
    const createFormField = FormFieldGenerator({ setFieldValue });

    const coalescedErrors = { ...errors, ...mutateOrderErrors };

    const itemIntent = Intent.NONE;

    return (
      <form onSubmit={handleSubmit}>
        <DialogBody>
          {children}
          <div className="pure-g">
            <div className="pure-u-1-2">
              <div style={{ paddingRight: "5px" }}>
                <FormGroup label="Item" labelInfo={true} intent={itemIntent}>
                  <ItemInput onSelect={v => this.onItemSelect(v)} autoFocus={true} />
                </FormGroup>
              </div>
            </div>
            <div className="pure-u-1-2">
              <div style={{ paddingLeft: "5px" }}>
                <FormGroup label="Selected item" intent={itemIntent}>
                  {WorkOrderForm.renderSelectedItem(values.item)}
                </FormGroup>
              </div>
            </div>
          </div>
          {createFormField({
            fieldName: "quantity",
            getError: () => coalescedErrors.quantity ?? "",
            getTouched: () => !!touched.quantity,
            getValue: () => values.quantity.toString(),
            placeholder: "1",
            type: "number",
          })}
          {createFormField({
            fieldName: "price",
            getError: () => coalescedErrors.price ?? "",
            getTouched: () => !!touched.price,
            getValue: () => values.price.toString(),
            placeholder: "1",
            type: "number",
          })}
        </DialogBody>
        <DialogActions>
          <Button
            text="Reset"
            intent={Intent.NONE}
            onClick={handleReset}
            disabled={!dirty || isSubmitting}
          />
          <Button
            type="submit"
            text="Add Order"
            intent={Intent.PRIMARY}
            icon="edit"
            disabled={isSubmitting || isSubmitDisabled}
          />
        </DialogActions>
      </form>
    );
  }

  private onItemSelect(item: IItem) {
    const { setFieldValue, setFieldTouched } = this.props;

    setFieldValue("item", item);
    setFieldTouched("item");
  }
}
