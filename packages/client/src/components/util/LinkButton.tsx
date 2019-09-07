import React from "react";

import { Button, IButtonProps } from "@blueprintjs/core";

interface ILinkButtonButtonProps extends IButtonProps {
  type?: "button" | "reset" | "submit";
}

export interface IRouteProps {
  locationPathname: string;
  historyPush: (destination: string) => void;
}

export interface IOwnProps {
  destination: string;
  buttonProps: ILinkButtonButtonProps;
  prefix?: boolean;
}

type Props = Readonly<IOwnProps & IRouteProps>;

export function LinkButton(props: Props) {
  const { destination, locationPathname, historyPush, buttonProps, prefix } = props;

  const active: boolean = (() => {
    if (typeof prefix === "undefined") {
      return locationPathname === destination;
    }

    return locationPathname.startsWith(destination);
  })();

  return <Button active={active} onClick={() => historyPush(destination)} {...buttonProps} />;
}
