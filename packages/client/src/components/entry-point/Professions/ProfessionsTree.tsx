import React from "react";

import { Classes, Intent, ITreeNode, Spinner, Tree } from "@blueprintjs/core";
import { IRegionComposite, IShortProfession, IShortRecipe, IShortSkillTier } from "@sotah-inc/core";

import { IClientRealm, IFetchData, IItemsData } from "../../../types/global";
import { FetchLevel } from "../../../types/main";
import { ShortProfessionIcon } from "../../util/ShortProfessionIcon";

// props
export interface IStateProps {
  currentRegion: IRegionComposite | null;
  currentRealm: IClientRealm | null;
  professions: IFetchData<IShortProfession[]>;
  selectedProfession: IShortProfession | null;
  selectedSkillTier: IShortSkillTier | null;
  selectedRecipe: IItemsData<IShortRecipe> | null;
  selectedSkillTierCategoryIndex: number;
}

export interface IDispatchProps {
  setSkillTierCategoryIndex: (v: number) => void;
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
    const { selectedSkillTierCategoryIndex, selectedRecipe } = this.props;

    return (
      <div style={{ marginTop: "10px" }}>
        <div className="pure-g">
          <div className="pure-u-1-4 profession-tree">
            <Tree
              contents={this.getProfessionNodes()}
              className={Classes.ELEVATION_0}
              onNodeClick={v => this.onNodeClick(v)}
              onNodeExpand={v => this.onNodeClick(v)}
              onNodeCollapse={v => this.onNodeClick(v)}
            />
          </div>
          <div className="pure-u-3-4">
            <div style={{ paddingLeft: "10px" }}>
              <p>Hello, world!</p>
              <p>{selectedSkillTierCategoryIndex}</p>
              <p>recipe: {selectedRecipe?.data.id ?? "none"}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  private getProfessionNodes(): ITreeNode[] {
    const { professions } = this.props;

    switch (professions.level) {
      case FetchLevel.success:
        break;
      case FetchLevel.initial:
        return [
          {
            icon: <Spinner size={20} value={0} intent={Intent.NONE} />,
            id: "loading-0",
            label: <span style={{ marginLeft: "5px" }}>Loading</span>,
          },
        ];
      case FetchLevel.failure:
        return [
          {
            icon: <Spinner size={20} intent={Intent.DANGER} value={1} />,
            id: "loading-0",
            label: <span style={{ marginLeft: "5px" }}>Failed to load professions!</span>,
          },
        ];
      default:
      case FetchLevel.fetching:
        return [
          {
            icon: <Spinner size={20} intent={Intent.PRIMARY} />,
            id: "loading-0",
            label: <span style={{ marginLeft: "5px" }}>Loading</span>,
          },
        ];
    }

    if (professions.data.length === 0) {
      return [{ id: "none-none", label: <em>None found.</em> }];
    }

    return professions.data.map(v => this.getProfessionNode(v));
  }

  // profession nodes
  private getProfessionNode(v: IShortProfession) {
    const { selectedProfession } = this.props;

    const isSelected = selectedProfession !== null && v.id === selectedProfession.id;

    const childNodes: ITreeNode[] = !isSelected
      ? []
      : v.skilltiers.map(skillTier => this.getSkillTierNode(skillTier));

    const result: ITreeNode = {
      childNodes,
      className: "profession-node",
      hasCaret: false,
      icon: <ShortProfessionIcon profession={v} />,
      id: `profession-${v.id}`,
      isExpanded: isSelected,
      isSelected,
      label: v.name,
    };

    return result;
  }

  private onProfessionNodeClick(id: string) {
    const { currentRegion, currentRealm, professions, browseToProfession } = this.props;

    if (currentRegion === null || currentRealm === null) {
      return;
    }

    const foundProfession = professions.data.find(v => v.id.toString() === id);
    if (!foundProfession) {
      return;
    }

    browseToProfession(currentRegion, currentRealm, foundProfession);
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
    const { selectedSkillTierCategoryIndex, selectedSkillTier } = this.props;

    const isSelected = selectedSkillTierCategoryIndex === categoryIndex;

    const childNodes = ((): ITreeNode[] => {
      if (!isSelected || selectedSkillTier === null) {
        return [];
      }

      const foundCategory = selectedSkillTier.categories[selectedSkillTierCategoryIndex];
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
    const { setSkillTierCategoryIndex, selectedSkillTierCategoryIndex } = this.props;

    const parsedIndex = Number(index);
    const nextIndex = selectedSkillTierCategoryIndex === parsedIndex ? -1 : parsedIndex;

    setSkillTierCategoryIndex(nextIndex);
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
      profession: (v: string) => this.onProfessionNodeClick(v),
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
