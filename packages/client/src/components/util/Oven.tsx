import React from "react";

import { IToastProps, Position, IToaster, Toaster } from "@blueprintjs/core";

export interface IStateProps {
  toast: IToastProps;
  index: number;
}

type Props = Readonly<IStateProps>;

export class Oven extends React.Component<Props> {
  private toaster: IToaster | undefined;

  private refHandlers = {
    toaster: (ref: Toaster) => {
      this.toaster = ref;
    },
  };

  public componentDidUpdate(prevProps: Props): void {
    // props
    const { index, toast } = this.props;

    if (index === prevProps.index) {
      return;
    }

    this.toaster?.show(toast);
  }

  public render(): React.ReactNode {
    return <Toaster position={Position.BOTTOM} ref={this.refHandlers.toaster} />;
  }
}
