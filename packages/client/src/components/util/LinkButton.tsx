import React from "react";

import { Button, IButtonProps } from "@blueprintjs/core";

interface ILinkButtonButtonProps extends IButtonProps {
  type?: "button" | "reset" | "submit";
}

export interface IRouteProps {
  locationPathname: string;
  historyPush: (destination: string, asDest?: string) => void;
}

export interface IOwnProps {
  destination: string;
  asDestination?: string;
  buttonProps: ILinkButtonButtonProps;
  prefix?: boolean;
}

type Props = Readonly<IOwnProps & IRouteProps>;

export function LinkButton(props: Props) {
  const { destination, locationPathname, historyPush, buttonProps, prefix, asDestination } = props;

  const comparisonDestination = typeof asDestination === "undefined" ? destination : asDestination;

  const active: boolean = (() => {
    if (typeof prefix === "undefined") {
      return locationPathname === comparisonDestination;
    }

    return locationPathname.startsWith(comparisonDestination);
  })();

  return (
    <Button
      active={active}
      onClick={() => historyPush(destination, asDestination)}
      {...buttonProps}
    />
  );
}
