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
import { IExpansion } from "@sotah-inc/core";

const ExpansionToggleSelect = Select.ofType<IExpansion>();

export interface IStateProps {
  expansions: IExpansion[];
  selectedExpansion: IExpansion | null;
}

export interface IOwnProps {
  onExpansionChange: (expansion: IExpansion) => void;
}

type Props = Readonly<IStateProps & IOwnProps>;

export class ExpansionToggle extends React.Component<Props> {
  public itemPredicate: ItemPredicate<IExpansion> = (query: string, item: IExpansion) => {
    query = query.toLowerCase();
    return (
      item.label.toLowerCase().indexOf(query) >= 0 || item.name.toLowerCase().indexOf(query) >= 0
    );
  };

  public itemRenderer: ItemRenderer<IExpansion> = (
    item: IExpansion,
    { handleClick, modifiers, index }: IItemRendererProps,
  ) => {
    if (!modifiers.matchesPredicate) {
      return null;
    }

    const { selectedExpansion } = this.props;
    const intent =
      selectedExpansion !== null && item.name === selectedExpansion.name
        ? Intent.PRIMARY
        : Intent.NONE;

    return (
      <MenuItem
        key={index}
        intent={intent}
        className={modifiers.active ? Classes.ACTIVE : ""}
        onClick={handleClick}
        text={item.label}
        label={item.name}
      />
    );
  };

  public itemListRenderer: ItemListRenderer<IExpansion> = (
    params: IItemListRendererProps<IExpansion>,
  ) => {
    const { items, itemsParentRef, renderItem } = params;
    const renderedItems = items.map(renderItem).filter(renderedItem => renderedItem !== null);
    return (
      <Menu ulRef={itemsParentRef}>
        <li>
          <H6>Select Expansion</H6>
        </li>
        {renderedItems}
      </Menu>
    );
  };

  public render(): React.ReactNode {
    const { expansions, onExpansionChange } = this.props;

    return (
      <ExpansionToggleSelect
        items={expansions}
        itemRenderer={this.itemRenderer}
        itemListRenderer={this.itemListRenderer}
        itemPredicate={this.itemPredicate}
        onItemSelect={onExpansionChange}
        resetOnSelect={true}
        resetOnClose={true}
      >
        {this.renderToggleButton()}
      </ExpansionToggleSelect>
    );
  }

  private renderToggleButton() {
    const { selectedExpansion } = this.props;

    if (selectedExpansion === null) {
      return <Button text="Select Expansion" rightIcon="double-caret-vertical" />;
    }

    return (
      <Button
        style={{ color: selectedExpansion.label_color }}
        text={selectedExpansion.label}
        rightIcon="double-caret-vertical"
      />
    );
  }
}
