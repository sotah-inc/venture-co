import React from "react";

import {
  Alignment,
  Callout,
  Classes,
  H4,
  Navbar,
  NavbarGroup,
  Switch,
  Tag,
} from "@blueprintjs/core";
import { IItem } from "@sotah-inc/core";

import { AuctionsOptions } from "../../../types/auction";
import { getItemTextValue } from "../../../util";
import { ItemInput } from "../../util";

export interface IStateProps {
  queryAuctionsOptions: AuctionsOptions;
  activeSelect: boolean;
}

export interface IDispatchProps {
  selectItemQueryAuctions: (item: IItem) => void;
  activeSelectChange: (v: boolean) => void;
}

type Props = Readonly<IStateProps & IDispatchProps>;

export class QueryAuctionsFilter extends React.Component<Props> {
  public render() {
    const {
      activeSelect,
      queryAuctionsOptions: { selected: selectedItems, initialQueryResults },
      activeSelectChange,
      selectItemQueryAuctions,
    } = this.props;

    return (
      <>
        <Navbar>
          <NavbarGroup align={Alignment.LEFT}>
            <ItemInput
              onSelect={selectItemQueryAuctions}
              closeOnSelect={activeSelect}
              itemIdActiveList={selectedItems.map(v => v.blizzard_meta.id)}
              initialResults={initialQueryResults}
            />
          </NavbarGroup>
          <NavbarGroup align={Alignment.RIGHT}>
            <Switch
              checked={activeSelect}
              label="Active"
              style={{ marginBottom: "0" }}
              onChange={() => activeSelectChange(!activeSelect)}
            />
          </NavbarGroup>
        </Navbar>
        {this.renderSelectedItems(selectedItems)}
      </>
    );
  }

  private renderSelectedItem(index: number, item: IItem) {
    const { selectItemQueryAuctions } = this.props;

    return (
      <Tag
        key={index}
        onRemove={() => selectItemQueryAuctions(item)}
        style={{ marginRight: "5px" }}
      >
        {getItemTextValue(item)}
      </Tag>
    );
  }

  private renderSelectedItems(selectedItems: IItem[]) {
    if (selectedItems.length === 0) {
      return;
    }

    return (
      <Callout>
        <H4 className={Classes.HEADING}>Filters</H4>
        <div className={Classes.TAG_INPUT}>
          <div className={Classes.TAG_INPUT_VALUES}>
            {selectedItems.map((v, i) => this.renderSelectedItem(i, v))}
          </div>
        </div>
      </Callout>
    );
  }
}
