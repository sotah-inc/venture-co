import React from "react";

import { Classes, ITreeNode, Tree } from "@blueprintjs/core";
import { IRegionComposite, IShortProfession, IShortRecipe, IShortSkillTier } from "@sotah-inc/core";

import { IClientRealm, IItemsData } from "../../../types/global";
import { ISelectedSkillTierCategory } from "../../../types/professions";

// props
export interface IStateProps {
  currentRegion: IRegionComposite | null;
  currentRealm: IClientRealm | null;
  selectedProfession: IShortProfession | null;
  selectedSkillTier: IShortSkillTier | null;
  selectedRecipe: IItemsData<IShortRecipe> | null;
  selectedSkillTierCategory: ISelectedSkillTierCategory;
}

export interface IDispatchProps {
  selectSkillTierCategory: (v: number) => void;
  deselectSkillTierCategory: () => void;
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
    recipe: IShortSkillTier["categories"][0]["recipes"][0],
  ) => void;
}

export type Props = Readonly<IStateProps & IDispatchProps & IRouteProps>;

interface INodeClickMap {
  [key: string]: (v: string) => void;
}

export class ProfessionsTree extends React.Component<Props> {
  public render() {
    const { selectedSkillTierCategory, selectedRecipe } = this.props;

    return (
      <div style={{ marginTop: "10px" }}>
        <div className="pure-g">
          <div className="pure-u-1-4 profession-tree">
            <Tree
              contents={this.getSkillTierNodes()}
              className={Classes.ELEVATION_0}
              onNodeClick={v => this.onNodeClick(v)}
              onNodeExpand={v => this.onNodeClick(v)}
              onNodeCollapse={v => this.onNodeClick(v)}
            />
          </div>
          <div className="pure-u-3-4">
            <div style={{ paddingLeft: "10px" }}>
              <p>Hello, world!</p>
              <p>{selectedSkillTierCategory.index}</p>
              <p>{selectedSkillTierCategory.isSelected ? "isSelected" : "not isSelected"}</p>
              <p>recipe: {selectedRecipe?.data.id ?? "none"}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  private getSelectedSkillTierRecipes(): Array<IShortSkillTier["categories"][0]["recipes"][0]> {
    const { selectedSkillTier } = this.props;

    if (selectedSkillTier === null) {
      return [];
    }

    return selectedSkillTier.categories.reduce<
      Array<IShortSkillTier["categories"][0]["recipes"][0]>
    >((recipesResult, category) => {
      return [...recipesResult, ...category.recipes];
    }, []);
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

    const isSelected = selectedSkillTier !== null && selectedSkillTier.id === v.id;

    const childNodes = ((): ITreeNode[] => {
      if (selectedSkillTier === null) {
        return [{ id: "", label: "Loading...", disabled: true }];
      }

      return selectedSkillTier.categories.map((skillTierCategory, i) =>
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
    const { currentRegion, currentRealm, browseToSkillTier, selectedProfession } = this.props;

    if (currentRegion === null || currentRealm === null || selectedProfession === null) {
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
      if (!isSelected || selectedSkillTier === null) {
        return [];
      }

      const foundCategory = selectedSkillTier.categories[selectedSkillTierCategory.index];
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
  private getRecipeNode(v: IShortSkillTier["categories"][0]["recipes"][0]) {
    const { selectedRecipe } = this.props;

    const result: ITreeNode = {
      className: "recipe-node",
      icon: this.renderRecipeNodeIcon(v.icon_url),
      id: `recipe-${v.id}`,
      isSelected: selectedRecipe !== null && selectedRecipe.data.id === v.id,
      label: v.name,
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
      browseToRecipe,
    } = this.props;

    if (
      currentRegion === null ||
      currentRealm === null ||
      selectedProfession === null ||
      selectedSkillTier === null
    ) {
      return;
    }

    const foundRecipe = this.getSelectedSkillTierRecipes().find(v => v.id.toString() === id);
    if (!foundRecipe) {
      return;
    }

    browseToRecipe(currentRegion, currentRealm, selectedProfession, selectedSkillTier, foundRecipe);
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
