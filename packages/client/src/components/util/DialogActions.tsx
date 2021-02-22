import React from "react";

import { Classes } from "@blueprintjs/core";

import { DialogFooter } from "./DialogFooter";

interface IProps {
  leftChildren?: React.ReactNode;

  children: React.ReactNode;
}

type Props = Readonly<IProps>;

const renderLeftChildren = (children?: React.ReactNode) => {
  if (!children) {
    return null;
  }

  return <div className={`${Classes.DIALOG_FOOTER_ACTIONS} ${Classes.ALIGN_LEFT}`}>{children}</div>;
};

export const DialogActions = (props: Props): JSX.Element => (
  <DialogFooter>
    {renderLeftChildren(props.leftChildren)}
    <div className={`${Classes.DIALOG_FOOTER_ACTIONS} ${Classes.ALIGN_RIGHT}`}>
      {props.children}
    </div>
  </DialogFooter>
);
