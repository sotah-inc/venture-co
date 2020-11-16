import React from "react";

import { Popover, PopoverInteractionKind, Position } from "@blueprintjs/core";
import { IShortItem } from "@sotah-inc/core";

import { IItemClasses } from "../../../../types/global";
import { ItemLink } from "../../../util/ItemLink";
import { ItemPopoverContent } from "../../../util/ItemPopover/ItemPopoverContent";

export interface IStateProps {
  itemClasses: IItemClasses;
}

type ItemTextFormatterResult = string | React.ReactNode;

export interface IOwnProps {
  item: IShortItem;

  onItemClick?: () => void;
  itemTextFormatter?: (itemText: string) => ItemTextFormatterResult;
  position?: Position;
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

  public render() {
    const { item, itemClasses, position, interactive, itemTextFormatter, onItemClick } = this.props;

    return (
      <Popover
        content={<ItemPopoverContent item={item} itemClasses={itemClasses} />}
        target={
          <ItemLink
            item={item}
            interactive={interactive}
            itemTextFormatter={itemTextFormatter}
            onItemClick={onItemClick}
          />
        }
        interactionKind={PopoverInteractionKind.HOVER}
        position={position ?? Position.RIGHT}
      />
    );
  }
}
