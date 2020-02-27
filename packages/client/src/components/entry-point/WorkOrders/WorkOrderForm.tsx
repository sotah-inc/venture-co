import React from "react";

import { Button, FormGroup, H5, Intent } from "@blueprintjs/core";
import {
  GameVersion,
  ICreateWorkOrderRequest,
  IItem,
  IPrefillWorkOrderItemResponse,
  IRegion,
  IStatusRealm,
} from "@sotah-inc/core";
import { FormikProps } from "formik";

import { IPrefillWorkOrderItemOptions } from "../../../api/work-order";
import { Generator as FormFieldGenerator } from "../../../components/util/FormField";
import { IFetchData } from "../../../types/global";
import { FetchLevel } from "../../../types/main";
import {
  currencyToText,
  getItemIconUrl,
  getItemTextValue,
  qualityToColorClass,
} from "../../../util";
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
  prefillWorkOrderItem: IFetchData<IPrefillWorkOrderItemResponse>;
  callPrefillWorkOrderItem: (opts: IPrefillWorkOrderItemOptions) => void;
  currentRegion: IRegion | null;
  currentRealm: IStatusRealm | null;
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

  public componentDidUpdate(prevProps: Props): void {
    const {
      mutateOrderErrors,
      mutateOrderLevel,
      onComplete,
      setSubmitting,
      handleReset,
      onFatalError,
      prefillWorkOrderItem,
      setFieldValue,
    } = this.props;

    if (prevProps.mutateOrderLevel !== mutateOrderLevel) {
      switch (mutateOrderLevel) {
        case FetchLevel.success:
          setSubmitting(false);
          handleReset();
          onComplete();

          break;
        case FetchLevel.failure:
          setSubmitting(false);
          if ("error" in mutateOrderErrors) {
            onFatalError(mutateOrderErrors.error);
          }

          break;
        default:
          break;
      }
    }

    if (prevProps.prefillWorkOrderItem.level !== prefillWorkOrderItem.level) {
      switch (prefillWorkOrderItem.level) {
        case FetchLevel.success:
          setFieldValue("price", prefillWorkOrderItem.data.currentPrice);

          break;
        default:
          break;
      }
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
          {this.renderPrice()}
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

  private renderPrice() {
    const {
      values,
      setFieldValue,
      errors,
      touched,
      mutateOrderErrors,
      prefillWorkOrderItem,
    } = this.props;

    switch (prefillWorkOrderItem.level) {
      case FetchLevel.success:
        break;
      case FetchLevel.failure:
        return (
          <p>
            <strong>Failed to prefill work-item data!</strong>
          </p>
        );
      case FetchLevel.fetching:
      case FetchLevel.initial:
      default:
        return (
          <p>
            <em>Loading...</em>
          </p>
        );
    }

    const createFormField = FormFieldGenerator({ setFieldValue });
    const coalescedErrors = { ...errors, ...mutateOrderErrors };

    return createFormField({
      fieldName: "price",
      getError: () => coalescedErrors.price ?? "",
      getTouched: () => !!touched.price,
      getValue: () => values.price.toString(),
      helperText: currencyToText(values.price),
      placeholder: "1",
      type: "number",
    });
  }

  private onItemSelect(item: IItem) {
    const {
      setFieldValue,
      setFieldTouched,
      callPrefillWorkOrderItem,
      currentRegion,
      currentRealm,
    } = this.props;

    if (currentRegion === null || currentRealm === null) {
      return;
    }

    setFieldValue("item", item);
    setFieldTouched("item");
    callPrefillWorkOrderItem({
      gameVersion: GameVersion.Retail,
      itemId: item.id,
      realmSlug: currentRealm.slug,
      regionName: currentRegion.name,
    });
  }
}
