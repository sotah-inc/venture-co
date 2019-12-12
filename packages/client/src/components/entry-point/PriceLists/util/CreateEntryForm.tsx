import React from "react";

import { Button, FormGroup, H5, Intent } from "@blueprintjs/core";
import { IItem, IPricelistEntryJson, ItemId } from "@sotah-inc/core";
import { FormikProps } from "formik";

import { Generator as FormFieldGenerator } from "../../../../components/util/FormField";
import { getItemIconUrl, getItemTextValue, qualityToColorClass } from "../../../../util";
import { DialogActions, DialogBody, ItemInput } from "../../../util";

export interface IOwnProps {
  onComplete: (entry: IPricelistEntryJson, item: IItem) => void;
  onItemSelect?: (item: IItem) => void;

  isSubmitDisabled?: boolean;
  externalItemError?: string;
  itemIdBlacklist?: ItemId[];
  leftChildren?: React.ReactNode;
}

export interface IFormValues {
  quantity: number;
  item: IItem | null;
}

export type Props = Readonly<IOwnProps & FormikProps<IFormValues>>;

export class CreateEntryForm extends React.Component<Props> {
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
        <img src={itemIcon} /> {textValue}
      </H5>
    );
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
      externalItemError,
      itemIdBlacklist,
      leftChildren,
    } = this.props;
    const createFormField = FormFieldGenerator({ setFieldValue });

    const itemIntent = this.getItemError() && touched.item ? Intent.DANGER : Intent.NONE;
    const isSubmitDisabled = isSubmitting || this.props.isSubmitDisabled || !!externalItemError;

    return (
      <form onSubmit={handleSubmit}>
        <DialogBody>
          {children}
          <div className="pure-g">
            <div className="pure-u-1-2">
              <div style={{ paddingRight: "5px" }}>
                <FormGroup
                  helperText={this.getItemError()}
                  label="Item"
                  labelInfo={true}
                  intent={itemIntent}
                >
                  <ItemInput
                    itemIdBlacklist={itemIdBlacklist}
                    onSelect={v => this.onItemSelect(v)}
                    autoFocus={true}
                  />
                </FormGroup>
              </div>
            </div>
            <div className="pure-u-1-2">
              <div style={{ paddingLeft: "5px" }}>
                <FormGroup label="Selected item" intent={itemIntent}>
                  {CreateEntryForm.renderSelectedItem(values.item)}
                </FormGroup>
              </div>
            </div>
          </div>
          {createFormField({
            fieldName: "quantity",
            getError: () => (errors.quantity ? errors.quantity : ""),
            getTouched: () => !!touched.quantity,
            getValue: () => values.quantity.toString(),
            placeholder: "1",
            type: "number",
          })}
        </DialogBody>
        <DialogActions leftChildren={leftChildren}>
          <Button
            text="Reset"
            intent={Intent.NONE}
            onClick={handleReset}
            disabled={!dirty || isSubmitting}
          />
          <Button
            type="submit"
            text="Add Entry"
            intent={Intent.PRIMARY}
            icon="edit"
            disabled={isSubmitDisabled}
          />
        </DialogActions>
      </form>
    );
  }

  private getItemError() {
    const { errors, externalItemError } = this.props;

    if (errors.item) {
      return errors.item;
    }

    if (externalItemError) {
      return externalItemError;
    }

    return null;
  }

  private onItemSelect(item: IItem) {
    const { setFieldValue, onItemSelect, setFieldTouched } = this.props;

    setFieldValue("item", item);
    setFieldTouched("item");
    if (onItemSelect) {
      onItemSelect(item);
    }
  }
}
