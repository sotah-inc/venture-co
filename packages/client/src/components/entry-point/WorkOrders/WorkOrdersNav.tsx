import React from "react";

import { Alignment, Navbar, NavbarGroup } from "@blueprintjs/core";
import { SortPerPage } from "@sotah-inc/core";

import { CountToggle } from "../../util/CountToggle";

export interface IStateProps {
  perPage: SortPerPage;
}

export interface IDispatchProps {
  setPerPage: (perPage: SortPerPage) => void;
}

type Props = Readonly<IDispatchProps & IStateProps>;

export class WorkOrdersNav extends React.Component<Props> {
  public render() {
    const { perPage, setPerPage } = this.props;

    return (
      <Navbar>
        <NavbarGroup align={Alignment.LEFT}>
          <CountToggle perPage={perPage} onCountChange={setPerPage} />
        </NavbarGroup>
      </Navbar>
    );
  }
}
