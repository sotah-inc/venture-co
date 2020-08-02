import React from "react";

import { Button, Classes, H6, Menu, MenuItem, Popover, Position } from "@blueprintjs/core";
import { SortPerPage } from "@sotah-inc/core";

export interface IStateProps {
  auctionsPerPage: number;
}

export interface IDispatchProps {
  onCountChange: (count: SortPerPage) => void;
}

type Props = Readonly<IStateProps & IDispatchProps>;

export class CountToggle extends React.Component<Props> {
  public renderMenuItem(count: number, index: number) {
    const { auctionsPerPage, onCountChange } = this.props;

    let className = "";
    if (auctionsPerPage === count) {
      className = Classes.ACTIVE;
    }

    return (
      <MenuItem
        key={index}
        className={className}
        text={`${count} results`}
        onClick={() => onCountChange(count)}
      />
    );
  }

  public renderMenu() {
    const counts: number[] = Object.values(SortPerPage)
      .filter(v => !isNaN(Number(v)))
      .map(Number);

    return (
      <Menu>
        <li>
          <H6>Results Per Page</H6>
        </li>
        {counts.map((count, index) => this.renderMenuItem(count, index))}
      </Menu>
    );
  }

  public render() {
    const { auctionsPerPage } = this.props;

    return (
      <Popover
        content={this.renderMenu()}
        target={<Button icon="double-caret-vertical">{auctionsPerPage} results</Button>}
        position={Position.BOTTOM_LEFT}
      />
    );
  }
}
