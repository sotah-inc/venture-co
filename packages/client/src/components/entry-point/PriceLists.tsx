import React from "react";

import { Classes, Intent, NonIdealState, Spinner } from "@blueprintjs/core";
import {
  IExpansion,
  IPricelistJson,
  IShortProfession,
  IProfessionPricelistJson,
  IConfigRegion,
  GameVersion,
} from "@sotah-inc/core";

import { ILoadRealmEntrypoint } from "../../actions/main";
import {
  ILoadPricelistsEntrypoint,
  ILoadPricelistsEntrypointFront,
} from "../../actions/price-lists";
import { CreateEntryDialogContainer } from "../../containers/entry-point/PriceLists/CreateEntryDialog";
import { ActionBarRouteContainer } from "../../route-containers/entry-point/PriceLists/ActionBar";
import { CreateListDialogRouteContainer } from "../../route-containers/entry-point/PriceLists/CreateListDialog";
import { DeleteListDialogRouteContainer } from "../../route-containers/entry-point/PriceLists/DeleteListDialog";
import { EditListDialogRouteContainer } from "../../route-containers/entry-point/PriceLists/EditListDialog";
import { PricelistTreeRouteContainer } from "../../route-containers/entry-point/PriceLists/PricelistTree";
import { IClientRealm } from "../../types/global";
import { AuthLevel, UserData } from "../../types/main";
import { setTitle } from "../../util";

export interface IStateProps {
  currentGameVersion: GameVersion | null;
  currentRealm: IClientRealm | null;
  currentRegion: IConfigRegion | null;
  selectedProfession: IShortProfession | null;
  selectedExpansion: IExpansion | null;
  expansions: IExpansion[];
  professions: IShortProfession[];
  selectedList: IPricelistJson | null;
  professionPricelists: IProfessionPricelistJson[];
  pricelists: IPricelistJson[];
  userData: UserData;
}

export interface IDispatchProps {
  changeIsLoginDialogOpen: (isLoginDialogOpen: boolean) => void;
  loadRealmEntrypoint: (payload: ILoadRealmEntrypoint) => void;
  loadPricelistsEntrypoint: (payload: ILoadPricelistsEntrypoint) => void;
}

export interface IRouteProps {
  routeParams: IRouteParams;
  redirectToExpansion: (
    gameVersion: GameVersion,
    region: IConfigRegion,
    realm: IClientRealm,
    expansion: IExpansion,
  ) => void;
  redirectToProfession: (
    gameVersion: GameVersion,
    region: IConfigRegion,
    realm: IClientRealm,
    expansion: IExpansion,
    profession: IShortProfession,
  ) => void;
  redirectToPricelist: (
    gameVersion: GameVersion,
    region: IConfigRegion,
    realm: IClientRealm,
    expansion: IExpansion,
    profession: IShortProfession,
    pricelist: IPricelistJson,
  ) => void;
}

export interface IRouteParams {
  game_version?: string;
  region_name?: string;
  realm_slug?: string;
  profession_slug?: string;
  expansion_name?: string;
  pricelist_slug?: string;
}

export interface IOwnProps {
  realmEntrypointData: ILoadRealmEntrypoint;
  pricelistsEntrypointData: ILoadPricelistsEntrypointFront;
}

type Props = Readonly<IStateProps & IDispatchProps & IOwnProps & IRouteProps>;

export class PriceLists extends React.Component<Props> {
  public componentDidMount(): void {
    const {
      loadPricelistsEntrypoint,
      loadRealmEntrypoint,
      pricelistsEntrypointData,
      realmEntrypointData,
      expansions,
      professions,
    } = this.props;

    loadRealmEntrypoint(realmEntrypointData);
    loadPricelistsEntrypoint({
      ...pricelistsEntrypointData,
      expansions,
      professions,
    });
  }

  public componentDidUpdate(prevProps: Props): void {
    const {
      routeParams: { game_version },
      currentGameVersion,
      loadRealmEntrypoint,
      realmEntrypointData,
      expansions,
      professions,
      pricelistsEntrypointData,
      loadPricelistsEntrypoint,
    } = this.props;

    if (prevProps.pricelistsEntrypointData.loadId !== pricelistsEntrypointData.loadId) {
      loadRealmEntrypoint(realmEntrypointData);
      loadPricelistsEntrypoint({
        ...pricelistsEntrypointData,
        expansions,
        professions,
      });

      return;
    }

    if (
      currentGameVersion === null ||
      game_version === undefined ||
      currentGameVersion !== game_version
    ) {
      return;
    }

    this.handleWithGameVersion(currentGameVersion);
  }

  public render(): React.ReactNode {
    const {
      userData,
      routeParams: { profession_slug },
      professions,
    } = this.props;

    if (profession_slug !== undefined && profession_slug.length > 0) {
      const professionId = Number(profession_slug.split("-")[0]);

      if (!professions.some(v => v.id === professionId)) {
        return (
          <NonIdealState
            title="Profession not found"
            description={`Profession ${profession_slug} could not be found`}
            icon={<Spinner className={Classes.LARGE} intent={Intent.DANGER} value={1} />}
          />
        );
      }
    }

    if (userData.authLevel === AuthLevel.unauthenticated) {
      return (
        <>
          <ActionBarRouteContainer />
          <PricelistTreeRouteContainer />
        </>
      );
    }

    return (
      <>
        <CreateListDialogRouteContainer />
        <CreateEntryDialogContainer />
        <EditListDialogRouteContainer />
        <DeleteListDialogRouteContainer />
        <ActionBarRouteContainer />
        <PricelistTreeRouteContainer />
      </>
    );
  }

  private handleWithGameVersion(gameVersion: GameVersion) {
    const {
      currentRegion,
      routeParams: { region_name },
    } = this.props;

    if (currentRegion === null || region_name === undefined || currentRegion.name !== region_name) {
      return;
    }

    this.handleWithRegion(gameVersion, currentRegion);
  }

  private handleWithRegion(gameVersion: GameVersion, region: IConfigRegion) {
    const {
      currentRealm,
      routeParams: { realm_slug },
    } = this.props;

    if (
      currentRealm === null ||
      realm_slug === undefined ||
      currentRealm.realm.slug !== realm_slug
    ) {
      return;
    }

    this.handleWithRealm(gameVersion, region, currentRealm);
  }

  private handleWithRealm(gameVersion: GameVersion, region: IConfigRegion, realm: IClientRealm) {
    const {
      routeParams: { expansion_name },
      selectedExpansion,
      redirectToExpansion,
      expansions,
    } = this.props;

    if (selectedExpansion === null) {
      if (expansion_name === undefined) {
        const nextExpansion = expansions.find(v => v.primary);
        if (nextExpansion === undefined) {
          return;
        }

        redirectToExpansion(gameVersion, region, realm, nextExpansion);

        return;
      }

      return;
    }

    if (expansion_name === undefined || selectedExpansion.name !== expansion_name) {
      return;
    }

    this.handleWithExpansion(gameVersion, region, realm, selectedExpansion);
  }

  private handleWithExpansion(
    gameVersion: GameVersion,
    region: IConfigRegion,
    realm: IClientRealm,
    expansion: IExpansion,
  ) {
    const {
      routeParams: { profession_slug },
      selectedProfession,
      professions,
      redirectToProfession,
    } = this.props;

    if (selectedProfession === null) {
      if (profession_slug === undefined) {
        if (professions.length === 0) {
          return;
        }

        const nextProfession = professions.sort((a, b) => a.name.localeCompare(b.name))[0];

        redirectToProfession(gameVersion, region, realm, expansion, nextProfession);

        return;
      }

      return;
    }

    if (profession_slug === undefined) {
      return;
    }

    const professionId = Number(profession_slug.split("-")[0]);
    if (selectedProfession.id !== professionId) {
      return;
    }

    this.handleWithProfession(gameVersion, region, realm, expansion, selectedProfession);
  }

  private handleWithProfession(
    gameVersion: GameVersion,
    region: IConfigRegion,
    realm: IClientRealm,
    expansion: IExpansion,
    profession: IShortProfession,
  ) {
    const {
      routeParams: { pricelist_slug },
      selectedList,
      professionPricelists,
      redirectToPricelist,
    } = this.props;

    if (selectedList === null) {
      if (pricelist_slug === undefined) {
        if (professionPricelists.length === 0) {
          return;
        }

        const nextPricelist = professionPricelists.sort((a, b) =>
          a.pricelist.name.localeCompare(b.pricelist.name),
        )[0].pricelist;

        redirectToPricelist(gameVersion, region, realm, expansion, profession, nextPricelist);

        return;
      }

      return;
    }

    if (pricelist_slug === undefined || selectedList.slug !== pricelist_slug) {
      return;
    }

    this.handleWithPricelist();
  }

  private handleWithPricelist() {
    this.setTitle();
  }

  private setTitle() {
    const {
      currentRegion,
      currentRealm,
      selectedProfession,
      selectedExpansion,
      selectedList,
    } = this.props;

    if (currentRegion === null || currentRealm === null) {
      return;
    }

    const prefixes = [
      "Profession Pricelists",
      `${currentRegion.name.toUpperCase()} ${currentRealm.realm.name.en_US}`,
    ];

    if (selectedExpansion === null) {
      setTitle(prefixes.join(" - "));

      return;
    }

    prefixes.unshift(selectedExpansion.label);

    if (selectedProfession === null) {
      setTitle(prefixes.join(" - "));

      return;
    }

    prefixes.unshift(selectedProfession.name);

    if (selectedList === null) {
      setTitle(prefixes.join(" - "));

      return;
    }

    prefixes.unshift(selectedList.name);

    setTitle(prefixes.join(" - "));
  }
}
