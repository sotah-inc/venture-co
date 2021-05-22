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
import { IGetBootResponseData, IShortProfession } from "@sotah-inc/core";

import { IFetchData } from "../../types/global";
import { ProfessionIcon } from "./ProfessionIcon";

const ProfessionToggleSelect = Select.ofType<IShortProfession>();

export interface IStateProps {
  bootData: IFetchData<IGetBootResponseData>;
  selectedProfession: IShortProfession | null;
}

export interface IOwnProps {
  onProfessionChange: (profession: IShortProfession) => void;
}

type Props = Readonly<IStateProps & IOwnProps>;

export class PricelistProfessionToggle extends React.Component<Props> {
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
    const intent =
      selectedProfession !== null && item.id === selectedProfession.id
        ? Intent.PRIMARY
        : Intent.NONE;

    return (
      <MenuItem
        key={index}
        intent={intent}
        className={modifiers.active ? Classes.ACTIVE : ""}
        onClick={handleClick}
        text={item.name}
        icon={<ProfessionIcon profession={item} />}
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
    const { bootData, onProfessionChange } = this.props;

    return (
      <ProfessionToggleSelect
        items={bootData.data.professions}
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
        text={selectedProfession.name}
        rightIcon="double-caret-vertical"
        icon={<ProfessionIcon profession={selectedProfession} />}
      />
    );
  }
}
