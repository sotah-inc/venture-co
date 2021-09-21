import React from "react";

import { Classes, Intent, NonIdealState, Spinner, Tree, TreeNodeInfo } from "@blueprintjs/core";
import {
  IConfigRegion,
  IShortProfession,
  IShortRecipe,
  IShortSkillTier,
  IShortSkillTierCategoryRecipe,
  ProfessionId,
  RecipeId,
} from "@sotah-inc/core";

import {
  TreeContentContainer,
} from "../../../containers/entry-point/Professions/ProfessionsTree/TreeContent";
import { IClientRealm, IItemsData } from "../../../types/global";
import { ISelectedSkillTier, ISelectedSkillTierCategory } from "../../../types/professions";
import { RecipePopover } from "../../util/RecipePopover";

// props
export interface IStateProps {
  loadId: string;
  currentRegion: IConfigRegion | null;
  currentRealm: IClientRealm | null;
  selectedProfession: IShortProfession | null | undefined;
  selectedProfessionId: ProfessionId;
  selectedSkillTier: ISelectedSkillTier;
  selectedRecipe: IItemsData<IShortRecipe> | null | undefined;
  selectedRecipeId: RecipeId;
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
    region: IConfigRegion,
    realm: IClientRealm,
    profession: IShortProfession,
  ) => void;
  browseToSkillTier: (
    region: IConfigRegion,
    realm: IClientRealm,
    profession: IShortProfession,
    skillTier: IShortProfession["skilltiers"][0],
  ) => void;
  browseToRecipe: (
    region: IConfigRegion,
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

interface IRecipeNameCounts {
  [recipeName: string]: number | undefined;
}

interface ICategoryRecipeNameCounts {
  [categoryName: string]: IRecipeNameCounts | undefined;
}

interface IState {
  categoryNameCounts: ICategoryRecipeNameCounts;
}

type State = Readonly<IState>;

export class ProfessionsTree extends React.Component<Props, State> {
  public state: State = {
    categoryNameCounts: {},
  };

  public componentDidMount(): void {
    this.generateCategoryNameCounts(null);
  }

  public componentDidUpdate(prevProps: Props): void {
    this.generateCategoryNameCounts(prevProps);
  }

  private generateCategoryNameCounts(prevProps: Props | null) {
    const { loadId, selectedSkillTier } = this.props;

    if (prevProps !== null && prevProps.loadId === loadId) {
      return;
    }

    if (selectedSkillTier.data === null) {
      return;
    }

    const categoryNameCounts = selectedSkillTier.data.categories.reduce<ICategoryRecipeNameCounts>(
      (foundCategoryNameCounts, category) => {
        return {
          ...foundCategoryNameCounts,
          [category.name]: category.recipes.reduce<IRecipeNameCounts>(
            (recipeNameCounts, recipe) => {
              const foundNameCount = recipeNameCounts[recipe.recipe.name];

              return {
                ...recipeNameCounts,
                [recipe.recipe.name]: foundNameCount === undefined ? 1 : foundNameCount + 1,
              };
            },
            {},
          ),
        };
      },
      {},
    );
    this.setState({
      categoryNameCounts,
    });
  }

  public render(): React.ReactNode {
    const { selectedProfession, selectedProfessionId } = this.props;

    if (selectedProfession === null) {
      return (
        <NonIdealState
          title={`Profession #${selectedProfessionId} not found`}
          icon={<Spinner className={Classes.LARGE} intent={Intent.DANGER} value={1} />}
        />
      );
    }

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
  private getSkillTierNodes(): TreeNodeInfo[] {
    const { selectedProfession } = this.props;

    if (selectedProfession === undefined || selectedProfession === null) {
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

    const childNodes = ((): TreeNodeInfo[] => {
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

    const result: TreeNodeInfo = {
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

    if (
      currentRegion === null ||
      currentRealm === null ||
      selectedProfession === undefined ||
      selectedProfession === null
    ) {
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
  ): TreeNodeInfo {
    const { selectedSkillTierCategory, selectedSkillTier } = this.props;

    const isSelected =
      selectedSkillTierCategory.index === categoryIndex && selectedSkillTierCategory.isSelected;

    const childNodes = ((): TreeNodeInfo[] => {
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
    const { selectedRecipe, selectedSkillTierCategory, selectedSkillTier } = this.props;
    const { categoryNameCounts } = this.state;

    const secondaryLabel = ((): string | null => {
      if (selectedSkillTier.data === null) {
        return null;
      }

      if (v.recipe.rank > 0) {
        return null;
      }

      const selectedCategoryItem =
        selectedSkillTier.data.categories[selectedSkillTierCategory.index];
      const foundCount = categoryNameCounts[selectedCategoryItem.name]?.[v.recipe.name];
      if (foundCount === undefined || foundCount === 1) {
        return null;
      }

      return `#${v.recipe.id}`;
    })();

    const result: TreeNodeInfo = {
      className: "recipe-node",
      icon: this.renderRecipeNodeIcon(v.recipe.icon_url),
      id: `recipe-${v.id}`,
      isSelected:
        selectedRecipe !== undefined && selectedRecipe !== null && selectedRecipe.data.id === v.id,
      label: <RecipePopover recipe={v} />,
      secondaryLabel,
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
      selectedProfession === undefined ||
      selectedProfession === null ||
      selectedSkillTier.data === null ||
      selectedRecipe === null
    ) {
      return;
    }

    if (selectedRecipe !== undefined && selectedRecipe.data.id.toString() === id) {
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

  private onNodeClick(node: TreeNodeInfo) {
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
