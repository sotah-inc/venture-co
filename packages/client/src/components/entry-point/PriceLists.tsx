import React from "react";

import { Classes, Intent, NonIdealState, Spinner } from "@blueprintjs/core";
import {
  IExpansion,
  IPricelistJson,
  IShortProfession,
  IProfessionPricelistJson,
  IRegionComposite,
} from "@sotah-inc/core";

import { ILoadRealmEntrypoint } from "../../actions/main";
import {
  ILoadPricelistsEntrypoint,
  ILoadPricelistsEntrypointFront,
} from "../../actions/price-lists";
import {
  CreateEntryDialogContainer,
} from "../../containers/entry-point/PriceLists/CreateEntryDialog";
import { ActionBarRouteContainer } from "../../route-containers/entry-point/PriceLists/ActionBar";
import {
  CreateListDialogRouteContainer,
} from "../../route-containers/entry-point/PriceLists/CreateListDialog";
import {
  DeleteListDialogRouteContainer,
} from "../../route-containers/entry-point/PriceLists/DeleteListDialog";
import {
  EditListDialogRouteContainer,
} from "../../route-containers/entry-point/PriceLists/EditListDialog";
import {
  PricelistTreeRouteContainer,
} from "../../route-containers/entry-point/PriceLists/PricelistTree";
import { IClientRealm } from "../../types/global";
import { AuthLevel, FetchLevel } from "../../types/main";
import { setTitle } from "../../util";

export interface IStateProps {
  authLevel: AuthLevel;
  currentRealm: IClientRealm | null;
  currentRegion: IRegionComposite | null;
  regions: IRegionComposite[];
  fetchRealmLevel: FetchLevel;
  realms: IClientRealm[];
  selectedProfession: IShortProfession | null;
  selectedExpansion: IExpansion | null;
  professions: IShortProfession[];
  expansions: IExpansion[];
  getProfessionPricelistsLevel: FetchLevel;
  selectedList: IPricelistJson | null;
  professionPricelists: IProfessionPricelistJson[];
  pricelists: IPricelistJson[];
}

export interface IDispatchProps {
  changeIsLoginDialogOpen: (isLoginDialogOpen: boolean) => void;
  loadRealmEntrypoint: (payload: ILoadRealmEntrypoint) => void;
  loadPricelistsEntrypoint: (payload: ILoadPricelistsEntrypoint) => void;
}

export interface IRouteProps {
  routeParams: IRouteParams;
  redirectToExpansion: (
    region: IRegionComposite,
    realm: IClientRealm,
    expansion: IExpansion,
  ) => void;
  redirectToProfession: (
    region: IRegionComposite,
    realm: IClientRealm,
    expansion: IExpansion,
    profession: IShortProfession,
  ) => void;
  redirectToPricelist: (
    region: IRegionComposite,
    realm: IClientRealm,
    expansion: IExpansion,
    profession: IShortProfession,
    pricelist: IPricelistJson,
  ) => void;
}

export interface IRouteParams {
  region_name?: string;
  realm_slug?: string;
  profession_id?: string;
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
      routeParams: { region_name },
      currentRegion,
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
      currentRegion === null ||
      (region_name !== undefined && currentRegion.config_region.name !== region_name)
    ) {
      return;
    }

    this.handleWithRegion(currentRegion);
  }

  public render(): React.ReactNode {
    const {
      authLevel,
      routeParams: { profession_id },
      professions,
    } = this.props;

    if (profession_id !== undefined && profession_id.length > 0) {
      if (!professions.some(v => v.id === Number(profession_id))) {
        return (
          <NonIdealState
            title="Profession not found"
            description={`Profession ${profession_id} could not be found`}
            icon={<Spinner className={Classes.LARGE} intent={Intent.DANGER} value={1} />}
          />
        );
      }
    }

    if (authLevel === AuthLevel.unauthenticated) {
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

  private handleWithRegion(region: IRegionComposite) {
    const {
      currentRealm,
      routeParams: { realm_slug },
    } = this.props;

    if (
      currentRealm === null ||
      (realm_slug !== undefined && currentRealm.realm.slug !== realm_slug)
    ) {
      return;
    }

    this.handleWithRealm(region, currentRealm);
  }

  private handleWithRealm(region: IRegionComposite, realm: IClientRealm) {
    const {
      routeParams: { expansion_name },
      selectedExpansion,
      redirectToExpansion,
      expansions,
    } = this.props;

    if (
      selectedExpansion === null ||
      (expansion_name !== undefined && selectedExpansion.name !== expansion_name)
    ) {
      if (expansions.length === 0) {
        return;
      }

      const nextExpansion = expansions.find(v => v.primary);
      if (nextExpansion === undefined) {
        return;
      }

      redirectToExpansion(region, realm, nextExpansion);

      return;
    }

    this.handleWithExpansion(region, realm, selectedExpansion);
  }

  private handleWithExpansion(
    region: IRegionComposite,
    realm: IClientRealm,
    expansion: IExpansion,
  ) {
    const {
      routeParams: { profession_id },
      selectedProfession,
      professions,
      redirectToProfession,
    } = this.props;

    if (
      selectedProfession === null ||
      (profession_id !== undefined && selectedProfession.id !== Number(profession_id))
    ) {
      if (professions.length === 0) {
        return;
      }

      const nextProfession = professions.sort((a, b) => a.name.localeCompare(b.name))[0];

      redirectToProfession(region, realm, expansion, nextProfession);

      return;
    }

    this.handleWithProfession(region, realm, expansion, selectedProfession);
  }

  private handleWithProfession(
    region: IRegionComposite,
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

    if (
      selectedList === null ||
      (pricelist_slug !== undefined && selectedList.slug !== pricelist_slug)
    ) {
      if (professionPricelists.length === 0) {
        return;
      }

      const nextPricelist = professionPricelists.sort((a, b) =>
        a.pricelist.name.localeCompare(b.pricelist.name),
      )[0].pricelist;

      redirectToPricelist(region, realm, expansion, profession, nextPricelist);

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
      `${currentRegion.config_region.name.toUpperCase()} ${currentRealm.realm.name.en_US}`,
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
