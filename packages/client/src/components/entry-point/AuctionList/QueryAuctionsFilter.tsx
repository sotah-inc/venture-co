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
import { IQueryGeneralItemItem, IShortItem, IShortPet } from "@sotah-inc/core";

import { IAuctionsOptions } from "../../../types/auction";
import { getItemTextValue } from "../../../util";
import { GeneralInput } from "../../util/GeneralInput";

export interface IStateProps {
  queryAuctionsOptions: IAuctionsOptions;
  activeSelect: boolean;
}

export interface IDispatchProps {
  selectItemQueryAuctions: (item: IShortItem) => void;
  selectPetQueryAuctions: (pet: IShortPet) => void;
  activeSelectChange: (v: boolean) => void;
}

type Props = Readonly<IStateProps & IDispatchProps>;

export class QueryAuctionsFilter extends React.Component<Props> {
  public render(): React.ReactNode {
    const {
      activeSelect,
      queryAuctionsOptions: { selected: selectedItems, initialQueryResults },
      activeSelectChange,
      selectItemQueryAuctions,
      selectPetQueryAuctions,
    } = this.props;

    return (
      <>
        <Navbar>
          <NavbarGroup align={Alignment.LEFT}>
            <GeneralInput
              onSelect={v => {
                if (v.item.item !== null) {
                  selectItemQueryAuctions(v.item.item);

                  return;
                }

                if (v.item.pet !== null) {
                  selectPetQueryAuctions(v.item.pet);
                }
              }}
              closeOnSelect={activeSelect}
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

  private renderSelectedItem(index: number, item: IQueryGeneralItemItem) {
    const { selectItemQueryAuctions, selectPetQueryAuctions } = this.props;

    const textValue = ((): string => {
      if (item.item !== null) {
        return getItemTextValue(item.item);
      }

      if (item.pet !== null) {
        return item.pet.name;
      }

      return "n/a";
    })();

    return (
      <Tag
        key={index}
        onRemove={() => {
          if (item.item !== null) {
            selectItemQueryAuctions(item.item);
          }

          if (item.pet !== null) {
            selectPetQueryAuctions(item.pet);
          }
        }}
        style={{ marginRight: "5px" }}
      >
        {textValue}
      </Tag>
    );
  }

  private renderSelectedItems(selectedItems: IQueryGeneralItemItem[]) {
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
