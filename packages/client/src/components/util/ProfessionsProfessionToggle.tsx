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
import { IShortProfession } from "@sotah-inc/core";

const ProfessionToggleSelect = Select.ofType<IShortProfession>();

export interface IStateProps {
  professions: IShortProfession[];
  selectedProfession: IShortProfession | null | undefined;
}

export interface IOwnProps {
  onProfessionChange: (profession: IShortProfession) => void;
}

type Props = Readonly<IStateProps & IOwnProps>;

export class ProfessionsProfessionToggle extends React.Component<Props> {
  public itemPredicate: ItemPredicate<IShortProfession> = (
    query: string,
    item: IShortProfession,
  ) => {
    query = query.toLowerCase();
    return (
      item.name.toLowerCase().indexOf(query) >= 0 || item.name.toLowerCase().indexOf(query) >= 0
    );
  };

  public itemRenderer: ItemRenderer<IShortProfession> = (
    item: IShortProfession,
    { handleClick, modifiers, index }: IItemRendererProps,
  ) => {
    if (!modifiers.matchesPredicate) {
      return null;
    }

    const { selectedProfession } = this.props;
    const intent = item.name === selectedProfession?.name ? Intent.PRIMARY : Intent.NONE;

    return (
      <MenuItem
        key={index}
        intent={intent}
        className={modifiers.active ? Classes.ACTIVE : ""}
        onClick={handleClick}
        text={item.name}
        icon={<img src={item.icon_url} className="item-icon" alt={item.name} />}
      />
    );
  };

  public itemListRenderer: ItemListRenderer<IShortProfession> = (
    params: IItemListRendererProps<IShortProfession>,
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

  public render(): React.ReactNode {
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

    if (typeof selectedProfession === "undefined" || selectedProfession === null) {
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
        text={selectedProfession.name}
        rightIcon="double-caret-vertical"
        icon={<img src={selectedProfession.icon_url} className="item-icon" />}
      />
    );
  }
}
