import React from "react";

import { IPriceListMap, IShortRecipe } from "@sotah-inc/core";

import { IFetchData, IItemsData } from "../../../../types/global";
import { ISelectedSkillTierCategory } from "../../../../types/professions";
import { IEntryRow, PricesTable } from "../../../util/PricesTable";

// props
export interface IStateProps {
  selectedRecipe: IItemsData<IShortRecipe> | null;
  selectedSkillTierCategory: ISelectedSkillTierCategory;
  priceTable: IFetchData<IItemsData<IPriceListMap>>;
}

export type Props = Readonly<IStateProps>;

export class TreeContent extends React.Component<Props> {
  public render() {
    const { selectedSkillTierCategory, selectedRecipe, priceTable } = this.props;

    if (selectedRecipe === null) {
      return null;
    }

    const entryRows = selectedRecipe.data.reagents.map<IEntryRow>(v => {
      return {
        item_id: v.reagent.id,
        quantity_modifier: v.quantity,
      };
    });

    return (
      <>
        <p>Hello, world!</p>
        <p>{selectedSkillTierCategory.index}</p>
        <p>{selectedSkillTierCategory.isSelected ? "isSelected" : "not isSelected"}</p>
        <p>recipe: {selectedRecipe?.data.id ?? "none"}</p>
        <PricesTable priceTable={priceTable} entryRows={entryRows} title="Reagent Prices" />
      </>
    );
  }
}
