import React from "react";

import { Button, Classes, H6, Menu, MenuItem } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import { SortPerPage } from "@sotah-inc/core";

export interface IStateProps {
  auctionsPerPage: number;
}

export interface IDispatchProps {
  onCountChange: (count: SortPerPage) => void;
}

type Props = Readonly<IStateProps & IDispatchProps>;

export class CountToggle extends React.Component<Props> {
  public renderMenuItem(count: number, index: number): JSX.Element {
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

  public renderMenu(): JSX.Element {
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

  public render(): React.ReactNode {
    const { auctionsPerPage } = this.props;

    return (
      <Popover2 content={this.renderMenu()} placement={"bottom-start"}>
        <Button icon="double-caret-vertical">{auctionsPerPage} results</Button>
      </Popover2>
    );
  }
}
