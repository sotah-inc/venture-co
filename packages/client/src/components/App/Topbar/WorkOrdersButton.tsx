import React from "react";

import { Button, ButtonGroup } from "@blueprintjs/core";

import { LinkButtonRouteContainer } from "../../../route-containers/util/LinkButton";

export interface IDispatchProps {
  changeIsWorkOrderDialogOpen: (isDialogOpen: boolean) => void;
}

export type Props = Readonly<IDispatchProps>;

export class WorkOrdersButton extends React.Component<Props> {
  public render() {
    const { changeIsWorkOrderDialogOpen } = this.props;

    return (
      <ButtonGroup>
        <LinkButtonRouteContainer
          destination="/marketplace/work-orders"
          buttonProps={{ icon: "flow-review", text: "Work Orders", minimal: true }}
          prefix={true}
        />
        <Button minimal={true} onClick={() => changeIsWorkOrderDialogOpen(true)} icon="plus" />
      </ButtonGroup>
    );
  }
}
