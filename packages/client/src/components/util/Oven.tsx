import React from "react";

import { IToastProps, Position, Toaster } from "@blueprintjs/core";

export interface IStateProps {
  toast: IToastProps;
  index: number;
}

type Props = Readonly<IStateProps>;

export class Oven extends React.Component<Props> {
  // @ts-ignore
  private toaster: Toaster;
  private refHandlers = {
    toaster: (ref: Toaster) => {
      this.toaster = ref;
    },
  };

  public componentDidUpdate(prevProps: Props) {
    // props
    const { index, toast } = this.props;

    if (index === prevProps.index) {
      return;
    }

    this.toaster.show(toast);
  }

  public render() {
    return <Toaster position={Position.BOTTOM} ref={this.refHandlers.toaster} />;
  }
}
