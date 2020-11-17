import React from "react";

import { Popover, PopoverInteractionKind, Position } from "@blueprintjs/core";
import { IShortSkillTierCategoryRecipe } from "@sotah-inc/core";

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

  private renderPopoverContent() {
    const { recipe } = this.props;

    return (
      <div className="recipe-popover-content">
        <div className="pure-g">
          <div className="pure-u-1-6">
            <p style={{ paddingBottom: "17px", marginBottom: 0 }}>
              <img src={recipe.icon_url} className="recipe-icon" alt="" />
            </p>
          </div>
          <div className="pure-u-5-6">
            <ul>
              <li>{recipe.name}</li>
            </ul>
            <hr />
            <ul>
              <li>Recipe id: {recipe.id}</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  public render() {
    const { recipe } = this.props;

    const label = recipe.rank > 0 ? `${recipe.name} (Rank ${recipe.rank})` : recipe.name;

    return (
      <Popover
        content={this.renderPopoverContent()}
        target={label}
        interactionKind={PopoverInteractionKind.HOVER}
        position={Position.RIGHT}
      />
    );
  }
}
