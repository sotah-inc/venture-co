import React from "react";

import { Classes } from "@blueprintjs/core";

export const DialogBody = (props: React.PropsWithChildren<React.ReactNode>): JSX.Element => (
  <div className={Classes.DIALOG_BODY}>{props.children}</div>
);
