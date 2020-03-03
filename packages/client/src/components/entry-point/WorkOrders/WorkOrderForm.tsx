import React from "react";

import { Button, Callout, FormGroup, H5, Intent, Position, Slider } from "@blueprintjs/core";
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
import { ItemPopoverContainer } from "../../../containers/util/ItemPopover";
import { IFetchData } from "../../../types/global";
import { FetchLevel } from "../../../types/main";
import {
  currencyToText,
  getItemIconUrl,
  getItemTextValue,
  qualityToColorClass,
  translatePriceToSliderData,
  translateQuantityToSliderData,
} from "../../../util";
import { Currency, DialogActions, DialogBody, ItemInput } from "../../util";

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
  price?: number;
  quantity?: number;
  item?: IItem | null;
}

export type Props = Readonly<IOwnProps & FormikProps<IFormValues>>;

export class WorkOrderForm extends React.Component<Props> {
  private static renderSelectedItem(item?: IItem | null) {
    if (typeof item === "undefined" || item === null) {
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
      values,
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
          const priceSliderData = translatePriceToSliderData(prefillWorkOrderItem);
          if (priceSliderData !== null) {
            setFieldValue("price", priceSliderData.min + priceSliderData.step);
          }

          const quantitySliderData = translateQuantityToSliderData(values.item);
          if (quantitySliderData !== null) {
            setFieldValue("quantity", quantitySliderData.min);
          }

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
          {this.renderTotal()}
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

  private renderTotal() {
    const { values } = this.props;

    if (
      typeof values.item === "undefined" ||
      values.item === null ||
      typeof values.quantity === "undefined" ||
      typeof values.price === "undefined"
    ) {
      return null;
    }

    const renderedCurrency = () => {
      return <Currency amount={values.price!} />;
    };
    const renderedItem = () => {
      return (
        <ItemPopoverContainer
          interactive={false}
          item={values.item!}
          position={Position.BOTTOM}
          itemTextFormatter={v => `${v} x${values.quantity}`}
        />
      );
    };

    return (
      <Callout title="New Order" style={{ marginTop: "10px" }} intent={Intent.PRIMARY}>
        Yes, create order for {renderedItem()} for {renderedCurrency()}.
      </Callout>
    );
  }

  private renderQuantity() {
    const {
      values,
      setFieldValue,
      setFieldTouched,
      errors,
      mutateOrderErrors,
      touched,
      prefillWorkOrderItem,
    } = this.props;

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

    const sliderData = translateQuantityToSliderData(values.item);

    if (sliderData === null) {
      return (
        <p>
          <em>Please select an item!</em>
        </p>
      );
    }

    const coalescedErrors = { ...mutateOrderErrors, ...errors };
    const intent = coalescedErrors.quantity && touched.quantity ? Intent.DANGER : Intent.NONE;
    const helperText = coalescedErrors.quantity && touched.quantity ? coalescedErrors.quantity : "";

    return (
      <FormGroup intent={intent} label="Quantity" helperText={helperText}>
        <Slider
          intent={intent}
          max={sliderData.max}
          min={sliderData.min}
          onChange={v => {
            setFieldValue("quantity", v);
            setFieldTouched("quantity");
          }}
          labelStepSize={sliderData.range}
          stepSize={sliderData.step}
          value={values.quantity}
          showTrackFill={false}
          vertical={true}
        />
      </FormGroup>
    );
  }

  private renderPrice() {
    const {
      prefillWorkOrderItem,
      setFieldValue,
      values,
      errors,
      touched,
      mutateOrderErrors,
      setFieldTouched,
    } = this.props;

    const coalescedErrors = { ...mutateOrderErrors, ...errors };

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

    const sliderValues = translatePriceToSliderData(prefillWorkOrderItem);
    if (sliderValues === null) {
      return (
        <p>
          <strong>Failed to prefill work-item data!</strong>
        </p>
      );
    }

    const { max, min, range, step } = sliderValues;
    const intent = coalescedErrors.price && touched.price ? Intent.DANGER : Intent.NONE;
    const helperText = coalescedErrors.price && touched.price ? coalescedErrors.price : "";

    return (
      <FormGroup label="Price" intent={intent} helperText={helperText}>
        <Slider
          intent={intent}
          max={max}
          min={min}
          onChange={v => {
            setFieldValue("price", v);
            setFieldTouched("price");
          }}
          labelRenderer={v => {
            return currencyToText(v, v > 100 * 100, formatParams => {
              return formatParams.filter(param => param !== null).join("\u00a0");
            });
          }}
          labelStepSize={range}
          stepSize={step}
          value={values.price}
          showTrackFill={false}
          vertical={true}
        />
      </FormGroup>
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
