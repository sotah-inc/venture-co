import React from "react";

import { PopoverInteractionKind } from "@blueprintjs/core";
import { Placement, Popover2 } from "@blueprintjs/popover2";
import { IShortItem } from "@sotah-inc/core";

import { IItemClasses } from "../../types/global";
import { ItemLink } from "./ItemLink";
import { ItemPopoverContent } from "./ItemPopover/ItemPopoverContent";

export interface IStateProps {
  itemClasses: IItemClasses;
}

type ItemTextFormatterResult = string | React.ReactNode;

export interface IOwnProps {
  item: IShortItem;

  onItemClick?: () => void;
  itemTextFormatter?: (itemText: string) => ItemTextFormatterResult;
  placement?: Placement;
  interactive?: boolean;
}

type Props = Readonly<IStateProps & IOwnProps>;

export class ItemPopover extends React.Component<Props> {
  public static defaultProps: Partial<Props> = {
    itemTextFormatter: (itemText: string) => itemText,
    onItemClick: () => {
      return;
    },
  };

  public render(): React.ReactNode {
    const {
      item,
      itemClasses,
      placement,
      interactive,
      itemTextFormatter,
      onItemClick,
    } = this.props;

    return (
      <Popover2
        content={<ItemPopoverContent item={item} itemClasses={itemClasses} />}
        interactionKind={PopoverInteractionKind.HOVER}
        placement={placement ?? "right"}
      >
        <ItemLink
          item={item}
          interactive={interactive}
          itemTextFormatter={itemTextFormatter}
          onItemClick={onItemClick}
        />
      </Popover2>
    );
  }
}
