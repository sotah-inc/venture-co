import React from "react";

import { IShortRecipe } from "@sotah-inc/core";

import { IItemsData } from "../../../../types/global";
import { ISelectedSkillTierCategory } from "../../../../types/professions";

// props
export interface IStateProps {
  selectedRecipe: IItemsData<IShortRecipe> | null;
  selectedSkillTierCategory: ISelectedSkillTierCategory;
}

export type Props = Readonly<IStateProps>;

export class TreeContent extends React.Component<Props> {
  public render() {
    const { selectedSkillTierCategory, selectedRecipe } = this.props;

    return (
      <>
        <p>Hello, world!</p>
        <p>{selectedSkillTierCategory.index}</p>
        <p>{selectedSkillTierCategory.isSelected ? "isSelected" : "not isSelected"}</p>
        <p>recipe: {selectedRecipe?.data.id ?? "none"}</p>
      </>
    );
  }
}
