import React from "react";

import { Button, Classes, H6, Intent, Menu, MenuItem } from "@blueprintjs/core";
import {
  IItemListRendererProps,
  IItemRendererProps,
  ItemListRenderer,
  ItemPredicate,
  ItemRenderer,
  Select,
} from "@blueprintjs/select";
import { IProfession } from "@sotah-inc/core";

import { ProfessionIcon } from "./ProfessionIcon";

const ProfessionToggleSelect = Select.ofType<IProfession>();

export interface IStateProps {
  professions: IProfession[];
  selectedProfession: IProfession | null;
}

export interface IOwnProps {
  onProfessionChange: (profession: IProfession) => void;
}

type Props = Readonly<IStateProps & IOwnProps>;

export class PricelistProfessionToggle extends React.Component<Props> {
  public itemPredicate: ItemPredicate<IProfession> = (query: string, item: IProfession) => {
    query = query.toLowerCase();
    return (
      item.label.toLowerCase().indexOf(query) >= 0 || item.name.toLowerCase().indexOf(query) >= 0
    );
  };

  public itemRenderer: ItemRenderer<IProfession> = (
    item: IProfession,
    { handleClick, modifiers, index }: IItemRendererProps,
  ) => {
    if (!modifiers.matchesPredicate) {
      return null;
    }

    const { selectedProfession } = this.props;
    const intent =
      selectedProfession !== null && item.name === selectedProfession.name
        ? Intent.PRIMARY
        : Intent.NONE;

    return (
      <MenuItem
        key={index}
        intent={intent}
        className={modifiers.active ? Classes.ACTIVE : ""}
        onClick={handleClick}
        text={item.label}
        icon={<ProfessionIcon profession={item} />}
      />
    );
  };

  public itemListRenderer: ItemListRenderer<IProfession> = (
    params: IItemListRendererProps<IProfession>,
  ) => {
    const { items, itemsParentRef, renderItem } = params;
    const renderedItems = items.map(renderItem).filter(renderedItem => renderedItem !== null);
    return (
      <Menu ulRef={itemsParentRef} className="pricelist-profession-toggle-menu">
        <li>
          <H6>Select Profession</H6>
        </li>
        {renderedItems}
      </Menu>
    );
  };

  public render() {
    const { professions, onProfessionChange } = this.props;

    return (
      <ProfessionToggleSelect
        items={professions}
        itemRenderer={this.itemRenderer}
        itemListRenderer={this.itemListRenderer}
        itemPredicate={this.itemPredicate}
        onItemSelect={onProfessionChange}
        resetOnSelect={true}
        resetOnClose={true}
      >
        {this.renderToggleButton()}
      </ProfessionToggleSelect>
    );
  }

  private renderToggleButton() {
    const { selectedProfession } = this.props;

    if (selectedProfession === null) {
      return (
        <Button
          className="profession-toggle-button"
          text="Select Profession"
          rightIcon="double-caret-vertical"
        />
      );
    }

    return (
      <Button
        className="profession-toggle-button"
        text={selectedProfession.label}
        rightIcon="double-caret-vertical"
        icon={<ProfessionIcon profession={selectedProfession} />}
      />
    );
  }
}
