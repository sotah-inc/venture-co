import React from "react";

import { Button, FormGroup, H5, Intent, Label, Slider } from "@blueprintjs/core";
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
  resetWorkOrderItemPrefill: () => void;
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
      isSubmitting,
      handleReset,
      handleSubmit,
      dirty,
      children,
      isSubmitDisabled,
      resetWorkOrderItemPrefill,
    } = this.props;

    const itemIntent = Intent.NONE;

    return (
      <form onSubmit={handleSubmit}>
        <DialogBody>
          {children}
          <div className="pure-g">
            <div className="pure-u-1-2">
              <div style={{ paddingRight: "5px" }}>
                <FormGroup label="Item" labelInfo={true} intent={itemIntent}>
                  <ItemInput onSelect={v => this.onItemSelect(v)} autoFocus={false} />
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
          <div className="pure-g">
            <div className="pure-u-1-2">{this.renderQuantity()}</div>
            <div className="pure-u-1-2">{this.renderPrice()}</div>
          </div>
        </DialogBody>
        <DialogActions>
          <Button
            text="Reset"
            intent={Intent.NONE}
            onClick={() => {
              handleReset();
              resetWorkOrderItemPrefill();
            }}
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

  private renderQuantity() {
    const { values, setFieldValue } = this.props;

    if (values.item === null) {
      return (
        <p>
          <em>Please select an item!</em>
        </p>
      );
    }

    interface IQuantitySliderProps {
      min: number;
      max: number;
      stepSize: number;
    }

    const { min, max, stepSize } = ((): IQuantitySliderProps => {
      switch (values.item.stackable) {
        case 200:
          return { min: 20, max: values.item.stackable, stepSize: 20 };
        case 1:
          return { min: 1, max: 10, stepSize: 1 };
        default:
          return { min: 1, max: values.item.stackable, stepSize: 1 };
      }
    })();

    return (
      <Label>
        Quantity
        <Slider
          max={max}
          min={min}
          onChange={v => setFieldValue("quantity", v)}
          labelStepSize={max - min}
          stepSize={stepSize}
          value={values.quantity < min ? min : values.quantity}
          showTrackFill={false}
          vertical={true}
        />
      </Label>
    );
  }

  private renderPrice() {
    const { prefillWorkOrderItem, setFieldValue, values } = this.props;

    if (values.item === null) {
      return (
        <p>
          <em>Please select an item!</em>
        </p>
      );
    }

    switch (prefillWorkOrderItem.level) {
      case FetchLevel.success:
        break;
      case FetchLevel.failure:
        return (
          <p>
            <strong>Failed to prefill work-item data!</strong>
          </p>
        );
      case FetchLevel.initial:
        return (
          <p>
            <em>Please select an item!</em>
          </p>
        );
      case FetchLevel.fetching:
      default:
        return (
          <p>
            <em>Loading...</em>
          </p>
        );
    }

    const min = prefillWorkOrderItem.data.currentPrice / 2;
    const max = prefillWorkOrderItem.data.currentPrice * 2;
    const range = max - min;
    const step = range / 6;
    const value = values.price > 0 ? values.price : min + step * 2;

    return (
      <Label>
        Price
        <Slider
          max={max}
          min={min}
          onChange={v => setFieldValue("price", v)}
          labelRenderer={v => {
            return currencyToText(v, v > 100 * 100, formatParams =>
              formatParams.filter(param => param !== null).join("\u00a0"),
            );
          }}
          labelStepSize={range}
          stepSize={step}
          value={value}
          showTrackFill={false}
          vertical={true}
        />
      </Label>
    );
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
