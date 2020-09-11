import React from "react";

import { Button, FormGroup, H5, Intent } from "@blueprintjs/core";
import { IShortItem, ItemId } from "@sotah-inc/core";
import { FormikProps } from "formik";

import { getItemIconUrl, getItemTextValue, qualityToColorClass } from "../../../../util";
import { DialogActions, DialogBody, ItemInput } from "../../../util";

export interface IOwnProps {
  onComplete: () => void;
  onItemSelect?: (item: IShortItem) => void;

  isSubmitDisabled?: boolean;
  externalItemError?: string;
  itemIdBlacklist?: ItemId[];
  leftChildren?: React.ReactNode;
  entriesTable: React.ReactNode;
}

export interface IFormValues {
  item: IShortItem | null;
}

export type Props = Readonly<IOwnProps & FormikProps<IFormValues>>;

export class BulkEntryForm extends React.Component<Props> {
  public render() {
    const {
      values,
      isSubmitting,
      handleReset,
      handleSubmit,
      dirty,
      touched,
      children,
      externalItemError,
      itemIdBlacklist,
      leftChildren,
      entriesTable,
    } = this.props;

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
                    onSelect={(v: IShortItem) => this.onItemSelect(v)}
                    autoFocus={true}
                    closeOnSelect={false}
                  />
                </FormGroup>
              </div>
            </div>
            <div className="pure-u-1-2">
              <div style={{ paddingLeft: "5px" }}>
                <FormGroup label="Selected item" intent={itemIntent}>
                  {this.renderSelectedItem(values.item)}
                </FormGroup>
              </div>
            </div>
          </div>
          {entriesTable}
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
            text="Continue"
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

  private onItemSelect(item: IShortItem) {
    const { setFieldValue, onItemSelect, setFieldTouched } = this.props;

    setFieldValue("item", item);
    setFieldTouched("item");
    if (onItemSelect) {
      onItemSelect(item);
    }
  }

  private renderSelectedItem(item: IShortItem | null) {
    if (item === null) {
      return (
        <p>
          <em>No item selected.</em>
        </p>
      );
    }

    const className = qualityToColorClass(item.quality.type);
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
}
