import React from "react";

import { Alignment, Navbar, NavbarGroup } from "@blueprintjs/core";
import { SortPerPage } from "@sotah-inc/core";

import { CountToggle } from "../../util/CountToggle";

export class WorkOrdersNav extends React.Component {
  public render() {
    return (
      <Navbar>
        <NavbarGroup align={Alignment.LEFT}>
          <CountToggle
            perPage={SortPerPage.Ten}
            onCountChange={v => {
              // tslint:disable-next-line:no-console
              console.log(v);
            }}
          />
        </NavbarGroup>
      </Navbar>
    );
  }
}
