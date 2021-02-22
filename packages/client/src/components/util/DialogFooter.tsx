import React from "react";

import { Classes } from "@blueprintjs/core";

export const DialogFooter = (props: React.PropsWithChildren<React.ReactNode>): JSX.Element => (
  <div className={Classes.DIALOG_FOOTER}>{props.children}</div>
);
