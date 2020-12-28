import React from "react";

import { H2, H4 } from "@blueprintjs/core";
import { IShortRecipe } from "@sotah-inc/core";
import { ReagentPricesTableContainer } from "../../../../containers/entry-point/Professions/ProfessionsTree/TreeContent/ReagentPricesTable";

import { RecipePriceHistoriesGraphContainer } from "../../../../containers/entry-point/Professions/ProfessionsTree/TreeContent/RecipePriceHistoriesGraph";
import { IItemsData } from "../../../../types/global";

// props
export interface IStateProps {
  selectedRecipe: IItemsData<IShortRecipe> | null | undefined;
}

export type Props = Readonly<IStateProps>;

export class TreeContent extends React.Component<Props> {
  public render() {
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
