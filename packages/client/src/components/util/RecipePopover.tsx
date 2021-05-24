import React from "react";

import { PopoverInteractionKind } from "@blueprintjs/core";
import { Popover2, Placement } from "@blueprintjs/popover2";
import { IShortRecipeReagent, IShortSkillTierCategoryRecipe } from "@sotah-inc/core";

export interface IOwnProps {
  recipe: IShortSkillTierCategoryRecipe;

  onClick?: () => void;
  renderContent?: () => React.ReactNode;
  placement?: Placement;
}

type Props = Readonly<IOwnProps>;

export class RecipePopover extends React.Component<Props> {
  public static defaultProps: Partial<Props> = {
    onClick: () => {
      return;
    },
    placement: "auto",
  };

  private renderReagent(reagent: IShortRecipeReagent, reagentIndex: number): JSX.Element {
    return (
      <li key={reagentIndex}>
        {reagent.quantity}x {reagent.reagent.name}
      </li>
    );
  }

  private renderReagents() {
    const { recipe } = this.props;

    return recipe.recipe.reagents.map((v, reagentIndex) => this.renderReagent(v, reagentIndex));
  }

  private renderPopoverContent() {
    const { recipe } = this.props;

    return (
      <div className="recipe-popover-content" onClick={e => e.stopPropagation()}>
        <div className="pure-g">
          <div className="pure-u-1-6">
            <p style={{ paddingBottom: "17px", marginBottom: 0 }}>
              <img src={recipe.recipe.icon_url} className="recipe-icon" alt={this.renderLabel()} />
            </p>
          </div>
          <div className="pure-u-5-6">
            <ul>
              {recipe.recipe.rank > 0 && (
                <li className="postscript">{`Rank ${recipe.recipe.rank}`}</li>
              )}
              <li>{recipe.recipe.name}</li>
              <li className="description">{recipe.recipe.description}</li>
              {this.renderReagents()}
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

  private renderContent(): React.ReactNode {
    const { renderContent } = this.props;

    if (!renderContent) {
      return this.renderLabel();
    }

    return renderContent();
  }

  public render(): React.ReactNode {
    const { placement } = this.props;

    return (
      <Popover2
        content={this.renderPopoverContent()}
        interactionKind={PopoverInteractionKind.HOVER}
        placement={placement}
      >
        {this.renderContent()}
      </Popover2>
    );
  }
}
