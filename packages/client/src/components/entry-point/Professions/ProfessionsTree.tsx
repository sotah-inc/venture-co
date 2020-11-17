import React from "react";

import { Classes, ITreeNode, Tree } from "@blueprintjs/core";
import {
  IRegionComposite,
  IShortProfession,
  IShortRecipe,
  IShortSkillTier,
  IShortSkillTierCategoryRecipe,
} from "@sotah-inc/core";

import { TreeContentContainer } from "../../../containers/entry-point/Professions/ProfessionsTree/TreeContent";
import { IClientRealm, IItemsData } from "../../../types/global";
import { ISelectedSkillTier, ISelectedSkillTierCategory } from "../../../types/professions";

// props
export interface IStateProps {
  currentRegion: IRegionComposite | null;
  currentRealm: IClientRealm | null;
  selectedProfession: IShortProfession | null;
  selectedSkillTier: ISelectedSkillTier;
  selectedRecipe: IItemsData<IShortRecipe> | null;
  selectedSkillTierCategory: ISelectedSkillTierCategory;
}

export interface IDispatchProps {
  selectSkillTierCategory: (v: number) => void;
  deselectSkillTierCategory: () => void;
  deselectSkillTierFlag: () => void;
  selectSkillTierFlag: () => void;
}

export interface IRouteProps {
  browseToProfession: (
    region: IRegionComposite,
    realm: IClientRealm,
    profession: IShortProfession,
  ) => void;
  browseToSkillTier: (
    region: IRegionComposite,
    realm: IClientRealm,
    profession: IShortProfession,
    skillTier: IShortProfession["skilltiers"][0],
  ) => void;
  browseToRecipe: (
    region: IRegionComposite,
    realm: IClientRealm,
    profession: IShortProfession,
    skillTier: IShortSkillTier,
    recipe: IShortSkillTierCategoryRecipe,
  ) => void;
}

export type Props = Readonly<IStateProps & IDispatchProps & IRouteProps>;

interface INodeClickMap {
  [key: string]: (v: string) => void;
}

export class ProfessionsTree extends React.Component<Props> {
  public render() {
    return (
      <div style={{ marginTop: "10px" }}>
        <div className="pure-g">
          <div className="pure-u-1-3 profession-tree">
            <Tree
              contents={this.getSkillTierNodes()}
              className={Classes.ELEVATION_0}
              onNodeClick={v => this.onNodeClick(v)}
              onNodeExpand={v => this.onNodeClick(v)}
              onNodeCollapse={v => this.onNodeClick(v)}
            />
          </div>
          <div className="pure-u-2-3">
            <div style={{ paddingLeft: "10px" }}>
              <TreeContentContainer />
            </div>
          </div>
        </div>
      </div>
    );
  }

  private getSelectedSkillTierRecipes(): IShortSkillTierCategoryRecipe[] {
    const { selectedSkillTier } = this.props;

    if (selectedSkillTier.data === null) {
      return [];
    }

    return selectedSkillTier.data.categories.reduce<IShortSkillTierCategoryRecipe[]>(
      (recipesResult, category) => {
        return [...recipesResult, ...category.recipes];
      },
      [],
    );
  }

  // skill-tier nodes
  private getSkillTierNodes(): ITreeNode[] {
    const { selectedProfession } = this.props;

    if (selectedProfession === null) {
      return [];
    }

    return selectedProfession.skilltiers.map(v => this.getSkillTierNode(v));
  }

  private getSkillTierNode(v: IShortProfession["skilltiers"][0]) {
    const { selectedSkillTier } = this.props;

    const isSelected =
      selectedSkillTier.data !== null &&
      selectedSkillTier.data.id === v.id &&
      selectedSkillTier.isSelected;

    const childNodes = ((): ITreeNode[] => {
      if (!selectedSkillTier.isSelected) {
        return [];
      }

      if (selectedSkillTier.data === null) {
        return [{ id: "", label: "Loading...", disabled: true }];
      }

      return selectedSkillTier.data.categories.map((skillTierCategory, i) =>
        this.getSkillTierCategoryNode(skillTierCategory, i),
      );
    })();

    const result: ITreeNode = {
      childNodes,
      className: "skilltier-node",
      hasCaret: true,
      id: `skilltier-${v.id}`,
      isExpanded: isSelected,
      isSelected,
      label: v.name,
    };

    return result;
  }

  private onSkillTierNodeClick(id: string) {
    const {
      currentRegion,
      currentRealm,
      browseToSkillTier,
      selectedProfession,
      selectedSkillTier,
      deselectSkillTierFlag,
      selectSkillTierFlag,
    } = this.props;

    if (currentRegion === null || currentRealm === null || selectedProfession === null) {
      return;
    }

    if (selectedSkillTier.data !== null && selectedSkillTier.data.id.toString() === id) {
      if (selectedSkillTier.isSelected) {
        deselectSkillTierFlag();

        return;
      }

      selectSkillTierFlag();

      return;
    }

    const foundSkillTier = selectedProfession.skilltiers.find(v => v.id.toString() === id);
    if (!foundSkillTier) {
      return;
    }

    browseToSkillTier(currentRegion, currentRealm, selectedProfession, foundSkillTier);
  }

  // skill-tier category nodes
  private getSkillTierCategoryNode(
    v: IShortSkillTier["categories"][0],
    categoryIndex: number,
  ): ITreeNode {
    const { selectedSkillTierCategory, selectedSkillTier } = this.props;

    const isSelected =
      selectedSkillTierCategory.index === categoryIndex && selectedSkillTierCategory.isSelected;

    const childNodes = ((): ITreeNode[] => {
      if (!isSelected || selectedSkillTier.data === null) {
        return [];
      }

      const foundCategory = selectedSkillTier.data.categories[selectedSkillTierCategory.index];
      if (!foundCategory) {
        return [];
      }

      return foundCategory.recipes.map(recipeCategory => this.getRecipeNode(recipeCategory));
    })();

    return {
      childNodes,
      className: "skilltier-category-node",
      hasCaret: true,
      id: `skilltier-category-${categoryIndex}`,
      isExpanded: isSelected,
      isSelected,
      label: v.name,
    };
  }

  private onSkillTierCategoryNodeClick(index: string) {
    const {
      selectedSkillTierCategory,
      deselectSkillTierCategory,
      selectSkillTierCategory,
    } = this.props;

    const parsedIndex = Number(index);
    if (parsedIndex === selectedSkillTierCategory.index) {
      deselectSkillTierCategory();

      return;
    }

    selectSkillTierCategory(parsedIndex);
  }

  // recipe nodes
  private getRecipeNode(v: IShortSkillTierCategoryRecipe) {
    const { selectedRecipe } = this.props;

    const label = v.rank > 0 ? `${v.name} (Rank ${v.rank})` : v.name;

    const result: ITreeNode = {
      className: "recipe-node",
      icon: this.renderRecipeNodeIcon(v.icon_url),
      id: `recipe-${v.id}`,
      isSelected: selectedRecipe !== null && selectedRecipe.data.id === v.id,
      label,
    };

    return result;
  }

  private renderRecipeNodeIcon(iconUrl: string) {
    if (iconUrl.length === 0) {
      return null;
    }

    return <img src={iconUrl} className="profession-icon" alt="" />;
  }

  private onRecipeNodeClick(id: string) {
    const {
      currentRegion,
      currentRealm,
      selectedSkillTier,
      selectedProfession,
      selectedRecipe,
      browseToRecipe,
    } = this.props;

    if (
      currentRegion === null ||
      currentRealm === null ||
      selectedProfession === null ||
      selectedSkillTier.data === null
    ) {
      return;
    }

    if (selectedRecipe !== null && selectedRecipe.data.id.toString() === id) {
      return;
    }

    const foundRecipe = this.getSelectedSkillTierRecipes().find(v => v.id.toString() === id);
    if (!foundRecipe) {
      return;
    }

    browseToRecipe(
      currentRegion,
      currentRealm,
      selectedProfession,
      selectedSkillTier.data,
      foundRecipe,
    );
  }

  private onNodeClick(node: ITreeNode) {
    const separatorIndex = node.id.toString().lastIndexOf("-");
    if (separatorIndex === -1) {
      return;
    }

    const [kind, id] = [
      node.id.toString().substr(0, separatorIndex),
      node.id.toString().substr(separatorIndex + 1),
    ];
    const nodeClickMap: INodeClickMap = {
      recipe: (v: string) => this.onRecipeNodeClick(v),
      skilltier: (v: string) => this.onSkillTierNodeClick(v),
      "skilltier-category": (v: string) => this.onSkillTierCategoryNodeClick(v),
    };

    if (!Object.keys(nodeClickMap).includes(kind)) {
      return;
    }

    nodeClickMap[kind](id);
  }
}
