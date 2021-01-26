import React from "react";

import { Button, IButtonProps } from "@blueprintjs/core";

interface ILinkButtonButtonProps extends IButtonProps {
  type?: "button" | "reset" | "submit";
}

export interface IRouteProps {
  locationPathname: string;
  historyPush: (destination: string, asDest?: string) => void;
}

export function defaultActiveCheck(
  locationPathname: string,
  comparisonDestination: string,
): boolean {
  return locationPathname === comparisonDestination;
}

export function prefixActiveCheck(
  locationPathname: string,
  comparisonDestination: string,
): boolean {
  return locationPathname.startsWith(comparisonDestination);
}

type ActiveFunc = (locationPathname: string, comparisonDestination: string) => boolean;

export interface IOwnProps {
  destination: string;
  asDestination?: string;
  buttonProps: ILinkButtonButtonProps;
  resolveActive?: ActiveFunc;
}

type Props = Readonly<IOwnProps & IRouteProps>;

export function LinkButton(props: Props) {
  const {
    destination,
    locationPathname,
    historyPush,
    buttonProps,
    asDestination,
    resolveActive,
  } = props;

  const comparisonDestination = typeof asDestination === "undefined" ? destination : asDestination;
  const activeCheck = resolveActive ?? defaultActiveCheck;

  return (
    <Button
      active={activeCheck(locationPathname, comparisonDestination)}
      onClick={() => historyPush(destination, asDestination)}
      {...buttonProps}
    />
  );
}
