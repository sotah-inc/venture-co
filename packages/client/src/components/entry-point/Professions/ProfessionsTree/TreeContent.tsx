import React from "react";

import { Classes, H2, H4, Intent, NonIdealState, Spinner } from "@blueprintjs/core";
import { IShortRecipe, RecipeId } from "@sotah-inc/core";

import { ReagentPricesTableContainer } from "../../../../containers/entry-point/Professions/ProfessionsTree/TreeContent/ReagentPricesTable";
import { RecipePriceHistoriesGraphContainer } from "../../../../containers/entry-point/Professions/ProfessionsTree/TreeContent/RecipePriceHistoriesGraph";
import { IItemsData } from "../../../../types/global";

// props
export interface IStateProps {
  selectedRecipe: IItemsData<IShortRecipe> | null | undefined;
  selectedRecipeId: RecipeId;
}

export type Props = Readonly<IStateProps>;

export class TreeContent extends React.Component<Props> {
  public render(): React.ReactNode {
    const { selectedRecipe, selectedRecipeId } = this.props;

    if (selectedRecipe === null) {
      return (
        <NonIdealState
          title={`Recipe #${selectedRecipeId} not found`}
          icon={<Spinner className={Classes.LARGE} intent={Intent.DANGER} value={1} />}
        />
      );
    }

    return (
      <>
        {this.renderTitle()}
        <H4>History</H4>
        <RecipePriceHistoriesGraphContainer />
        <ReagentPricesTableContainer />
      </>
    );
  }

  private renderTitle() {
    const { selectedRecipe } = this.props;

    if (selectedRecipe === null || typeof selectedRecipe === "undefined") {
      return null;
    }

    if (selectedRecipe.data.icon_url.length === 0) {
      return <H2>{selectedRecipe.data.name}</H2>;
    }

    return (
      <H2 className="recipe-price-histories-table-heading">
        <img src={selectedRecipe.data.icon_url} className="profession-icon" alt="" />{" "}
        {selectedRecipe.data.name}
      </H2>
    );
  }
}
