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
              <img src={recipe.recipe.icon_url} className="recipe-icon" alt={this.renderLabel()} />
            </p>
          </div>
          <div className="pure-u-5-6">
            <ul>
              <li>{this.renderLabel()}</li>
              <li className="description">{recipe.recipe.name}</li>
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

  private renderLabel(): string {
    const { recipe } = this.props;

    return recipe.recipe.rank > 0
      ? `${recipe.recipe.name} (Rank ${recipe.recipe.rank})`
      : recipe.recipe.name;
  }

  public render() {
    return (
      <Popover
        content={this.renderPopoverContent()}
        target={this.renderLabel()}
        interactionKind={PopoverInteractionKind.HOVER}
        position={Position.RIGHT}
      />
    );
  }
}
