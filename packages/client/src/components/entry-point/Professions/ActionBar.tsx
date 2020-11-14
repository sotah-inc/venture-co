import React from "react";

import { Alignment, ButtonGroup, Navbar, NavbarGroup } from "@blueprintjs/core";
import { IRegionComposite, IShortProfession, IShortRecipe, IShortSkillTier } from "@sotah-inc/core";

import { ProfessionsProfessionToggleContainer } from "../../../containers/util/ProfessionsProfessionToggle";
import { RealmToggleContainer } from "../../../containers/util/RealmToggle";
import { RegionToggleContainer } from "../../../containers/util/RegionToggle";
import { IClientRealm, IItemsData } from "../../../types/global";

export interface IStateProps {
  currentRegion: IRegionComposite | null;
  currentRealm: IClientRealm | null;
  selectedProfession: IShortProfession | null;
  selectedSkillTier: IShortSkillTier | null;
  selectedRecipe: IItemsData<IShortRecipe> | null;
}

export interface IRouteProps {
  browseToRealm: (region: IRegionComposite, realm: IClientRealm) => void;
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
    recipe: IShortRecipe,
  ) => void;
}

export type Props = Readonly<IStateProps & IRouteProps>;

export class ActionBar extends React.Component<Props> {
  public render() {
    return (
      <Navbar className="professions-actionbar">
        <NavbarGroup align={Alignment.RIGHT}>
          <ButtonGroup>
            <ProfessionsProfessionToggleContainer
              onProfessionChange={(v: IShortProfession) => this.onProfessionChange(v)}
            />
            <RealmToggleContainer onRealmChange={(v: IClientRealm) => this.onRealmChange(v)} />
            <RegionToggleContainer />
          </ButtonGroup>
        </NavbarGroup>
      </Navbar>
    );
  }

  private onRealmChange(realm: IClientRealm) {
    const {
      currentRegion,
      selectedProfession,
      selectedSkillTier,
      selectedRecipe,
      browseToProfession,
      browseToRecipe,
      browseToSkillTier,
      browseToRealm,
    } = this.props;

    if (currentRegion === null) {
      return;
    }

    if (selectedProfession === null) {
      browseToRealm(currentRegion, realm);

      return;
    }

    if (selectedSkillTier === null) {
      browseToProfession(currentRegion, realm, selectedProfession);

      return;
    }

    if (selectedRecipe === null) {
      browseToSkillTier(currentRegion, realm, selectedProfession, selectedSkillTier);

      return;
    }

    browseToRecipe(
      currentRegion,
      realm,
      selectedProfession,
      selectedSkillTier,
      selectedRecipe.data,
    );
  }

  private onProfessionChange(profession: IShortProfession) {
    const { currentRegion, currentRealm, browseToProfession } = this.props;

    if (currentRegion === null || currentRealm === null) {
      return;
    }

    browseToProfession(currentRegion, currentRealm, profession);
  }
}
