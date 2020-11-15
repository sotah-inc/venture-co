import React from "react";

import { IRegionComposite, IShortProfession, IShortRecipe, IShortSkillTier } from "@sotah-inc/core";

import { ILoadRealmEntrypoint } from "../../actions/main";
import { ILoadProfessionsEndpoint } from "../../actions/professions";
import { ActionBarRouteContainer } from "../../route-containers/entry-point/Professions/ActionBar";
import { ProfessionsTreeRouteContainer } from "../../route-containers/entry-point/Professions/ProfessionsTree";
import { IClientRealm, IFetchData } from "../../types/global";
import { ISelectedSkillTierCategory } from "../../types/professions";
import { setTitle } from "../../util";

export interface IStateProps {
  professions: IFetchData<IShortProfession[]>;
  currentRegion: IRegionComposite | null;
  currentRealm: IClientRealm | null;
  selectedProfession: IShortProfession | null;
  selectedSkillTierCategory: ISelectedSkillTierCategory;
  selectedRecipe: IShortRecipe | null;
  selectedSkillTier: IShortSkillTier | null;
}

export interface IDispatchProps {
  loadRealmEntrypoint: (payload: ILoadRealmEntrypoint) => void;
  loadEntrypointData: (payload: ILoadProfessionsEndpoint) => void;
  selectSkillTierCategory: (v: number) => void;
  deselectSkillTierCategory: () => void;
}

export interface IOwnProps {
  realmEntrypointData: ILoadRealmEntrypoint;
  entrypointData: ILoadProfessionsEndpoint;
}

export interface IRouteProps {
  redirectToProfession: (
    region: IRegionComposite,
    realm: IClientRealm,
    profession: IShortProfession,
  ) => void;
  redirectToSkillTier: (
    region: IRegionComposite,
    realm: IClientRealm,
    profession: IShortProfession,
    skillTier: IShortProfession["skilltiers"][0],
  ) => void;
  redirectToRecipe: (
    region: IRegionComposite,
    realm: IClientRealm,
    profession: IShortProfession,
    skillTier: IShortSkillTier,
    recipe: IShortSkillTier["categories"][0]["recipes"][0],
  ) => void;
}

type Props = Readonly<IStateProps & IDispatchProps & IOwnProps & IRouteProps>;

export class Professions extends React.Component<Props> {
  public componentDidMount() {
    const {
      entrypointData,
      loadEntrypointData,
      loadRealmEntrypoint,
      realmEntrypointData,
    } = this.props;

    setTitle("Professions");

    loadEntrypointData(entrypointData);
    loadRealmEntrypoint(realmEntrypointData);
  }

  public componentDidUpdate(prevProps: Props) {
    const {
      entrypointData,
      loadEntrypointData,
      loadRealmEntrypoint,
      realmEntrypointData,
      currentRegion,
      currentRealm,
      selectedProfession,
      redirectToProfession,
      professions,
      selectedSkillTier,
      selectedRecipe,
      redirectToRecipe,
      redirectToSkillTier,
      selectedSkillTierCategory,
    } = this.props;

    if (entrypointData.loadId !== prevProps.entrypointData.loadId) {
      setTitle("Professions");

      loadRealmEntrypoint(realmEntrypointData);
      loadEntrypointData(entrypointData);

      return;
    }

    if (currentRegion === null || currentRealm === null) {
      return;
    }

    if (selectedProfession === null) {
      const nextProfession = ((): IShortProfession | null => {
        if (professions.data.length === 0) {
          return null;
        }

        return professions.data[0];
      })();
      if (nextProfession === null) {
        return;
      }

      redirectToProfession(currentRegion, currentRealm, nextProfession);

      return;
    }

    if (selectedSkillTier === null) {
      const nextSkillTier = ((): IShortProfession["skilltiers"][0] | null => {
        if (selectedProfession.skilltiers.length === 0) {
          return null;
        }

        return selectedProfession.skilltiers[0];
      })();

      if (nextSkillTier === null) {
        return;
      }

      redirectToSkillTier(currentRegion, currentRealm, selectedProfession, nextSkillTier);

      return;
    }

    if (selectedSkillTier.categories.length === 0) {
      return;
    }

    const foundSkillTierCategory = selectedSkillTier.categories[selectedSkillTierCategory.index];
    if (!foundSkillTierCategory) {
      return;
    }

    if (selectedRecipe === null && selectedSkillTierCategory.isSelected) {
      const nextRecipe = ((): IShortSkillTier["categories"][0]["recipes"][0] | null => {
        if (foundSkillTierCategory.recipes.length === 0) {
          return null;
        }

        return foundSkillTierCategory.recipes[0];
      })();

      if (nextRecipe === null) {
        return;
      }

      redirectToRecipe(
        currentRegion,
        currentRealm,
        selectedProfession,
        selectedSkillTier,
        nextRecipe,
      );
    }
  }

  public render() {
    const { currentRegion, currentRealm, selectedProfession } = this.props;

    if (currentRegion === null || currentRealm === null || selectedProfession === null) {
      return null;
    }

    return (
      <>
        <ActionBarRouteContainer />
        <ProfessionsTreeRouteContainer />
      </>
    );
  }
}
