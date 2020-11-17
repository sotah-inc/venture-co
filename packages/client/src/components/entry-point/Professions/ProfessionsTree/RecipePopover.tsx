import React from "react";

import { Popover, PopoverInteractionKind, Position } from "@blueprintjs/core";
import { IShortSkillTierCategoryRecipe } from "@sotah-inc/core";

import { ItemLink } from "../../../util/ItemLink";
import { ItemPopoverContent } from "../../../util/ItemPopover/ItemPopoverContent";

export interface IOwnProps {
  recipe: IShortSkillTierCategoryRecipe;

  onClick?: () => void;
}

type Props = Readonly<IOwnProps>;

export class RecipePopover extends React.Component<Props> {
  public static defaultProps: Partial<Props> = {
    onClick: () => {
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
