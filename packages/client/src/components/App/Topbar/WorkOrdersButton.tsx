import React from "react";

import { Button, ButtonGroup } from "@blueprintjs/core";

import { LinkButtonRouteContainer } from "../../../route-containers/util/LinkButton";
import { prefixActiveCheck } from "../../util/LinkButton";

export interface IDispatchProps {
  changeIsWorkOrderDialogOpen: (isDialogOpen: boolean) => void;
}

export interface IRouteProps {
  locationPathname: string;
}

export type IOwnProps = IRouteProps;

export type Props = Readonly<IDispatchProps & IOwnProps>;

export class WorkOrdersButton extends React.Component<Props> {
  public render() {
    const { changeIsWorkOrderDialogOpen, locationPathname } = this.props;

    return (
      <ButtonGroup>
        <LinkButtonRouteContainer
          destination="/marketplace/work-orders"
          buttonProps={{ icon: "flow-review", text: "Work Orders", minimal: true }}
          resolveActive={prefixActiveCheck}
        />
        <Button
          active={locationPathname.startsWith("/marketplace/work-orders")}
          minimal={true}
          onClick={() => changeIsWorkOrderDialogOpen(true)}
          icon="plus"
        />
      </ButtonGroup>
    );
  }
}
