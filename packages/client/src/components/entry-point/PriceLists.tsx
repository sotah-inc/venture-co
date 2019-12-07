import React from "react";

import { Classes, Intent, NonIdealState, Spinner } from "@blueprintjs/core";
import { IExpansion, IPricelistJson, IProfession, IRegion, IStatusRealm } from "@sotah-inc/core";

import { ILoadRealmEntrypoint } from "../../actions/main";
import {
  ILoadPricelistsEntrypoint,
  ILoadPricelistsEntrypointFront,
} from "../../actions/price-lists";
// tslint:disable-next-line:max-line-length
import { CreateEntryDialogContainer } from "../../containers/entry-point/PriceLists/CreateEntryDialog";
import { ActionBarRouteContainer } from "../../route-containers/entry-point/PriceLists/ActionBar";
// tslint:disable-next-line:max-line-length
import { CreateListDialogRouteContainer } from "../../route-containers/entry-point/PriceLists/CreateListDialog";
// tslint:disable-next-line:max-line-length
import { DeleteListDialogRouteContainer } from "../../route-containers/entry-point/PriceLists/DeleteListDialog";
// tslint:disable-next-line:max-line-length
import { EditListDialogRouteContainer } from "../../route-containers/entry-point/PriceLists/EditListDialog";
// tslint:disable-next-line:max-line-length
import { PricelistTreeRouteContainer } from "../../route-containers/entry-point/PriceLists/PricelistTree";
import { IRealms, IRegions } from "../../types/global";
import { AuthLevel, FetchLevel } from "../../types/main";
import { IExpansionProfessionPricelistMap } from "../../types/price-lists";
import { setTitle } from "../../util";

export interface IStateProps {
  authLevel: AuthLevel;

  currentRealm: IStatusRealm | null;
  currentRegion: IRegion | null;
  regions: IRegions;
  fetchRealmLevel: FetchLevel;
  realms: IRealms;
  selectedProfession: IProfession | null;
  selectedExpansion: IExpansion | null;
  professions: IProfession[];
  expansions: IExpansion[];
  getProfessionPricelistsLevel: FetchLevel;
  selectedList: IPricelistJson | null;
  professionPricelists: IExpansionProfessionPricelistMap;
  pricelists: IPricelistJson[];
}

export interface IDispatchProps {
  changeIsLoginDialogOpen: (isLoginDialogOpen: boolean) => void;
  changeSelectedList: (list: IPricelistJson) => void;
  resetProfessionsSelections: () => void;
  loadRealmEntrypoint: (payload: ILoadRealmEntrypoint) => void;
  loadPricelistsEntrypoint: (payload: ILoadPricelistsEntrypoint) => void;
}

export interface IRouteProps {
  routeParams: IRouteParams;
  redirectToPricelist: (
    region: IRegion,
    realm: IStatusRealm,
    profession: IProfession,
    expansion: IExpansion,
    pricelist: IPricelistJson,
  ) => void;
}

export interface IRouteParams {
  region_name: string;
  realm_slug: string;
  profession_name: string;
  expansion_name: string;
  pricelist_slug: string;
}

export interface IOwnProps {
  loadId: string;
  realmEntrypointData: ILoadRealmEntrypoint;
  pricelistsEntrypointData?: ILoadPricelistsEntrypointFront;
}

type Props = Readonly<IStateProps & IDispatchProps & IOwnProps & IRouteProps>;

export class PriceLists extends React.Component<Props> {
  public componentDidMount() {
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

  public componentDidUpdate(prevProps: Props) {
    const {
      routeParams: { region_name, realm_slug },
      currentRegion,
      currentRealm,
      loadId,
      loadRealmEntrypoint,
      realmEntrypointData,
    } = this.props;

    if (prevProps.loadId !== loadId) {
      loadRealmEntrypoint(realmEntrypointData);

      return;
    }

    if (currentRegion === null || currentRegion.name !== region_name) {
      return;
    }

    if (currentRealm === null || currentRealm.slug !== realm_slug) {
      return;
    }

    this.handleWithRealm();
  }

  public render() {
    const {
      authLevel,
      routeParams: { profession_name },
      professions,
    } = this.props;

    if (profession_name.length > 0) {
      const hasProfession = professions.reduce<boolean>((previousValue, currentValue) => {
        if (previousValue) {
          return previousValue;
        }

        return currentValue.name === profession_name;
      }, false);

      if (!hasProfession) {
        return (
          <NonIdealState
            title="Profession not found"
            description={`Profession ${profession_name} could not be found`}
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

  private handleWithRealm() {
    const {
      routeParams: { profession_name, pricelist_slug },
      selectedProfession,
      selectedExpansion,
      selectedList,
      resetProfessionsSelections,
      pricelists,
      changeSelectedList,
    } = this.props;

    if (profession_name.length === 0) {
      if (pricelist_slug.length === 0) {
        if (selectedProfession !== null || selectedExpansion !== null || selectedList !== null) {
          resetProfessionsSelections();

          return;
        }

        return;
      }

      const foundList = pricelists.reduce<IPricelistJson | null>((prevValue, curValue) => {
        if (prevValue !== null) {
          return prevValue;
        }

        if (curValue.slug === pricelist_slug) {
          return curValue;
        }

        return null;
      }, null);
      if (foundList === null) {
        return;
      }

      if (selectedList === null || foundList.id !== selectedList.id) {
        changeSelectedList(foundList);

        return;
      }

      this.setTitle();

      return;
    }

    if (selectedProfession === null || selectedProfession.name !== profession_name) {
      return;
    }

    this.handleWithProfession();
  }

  private handleWithProfession() {
    const {
      routeParams: { expansion_name },
      currentRegion,
      currentRealm,
      selectedProfession,
      selectedExpansion,
      getProfessionPricelistsLevel,
    } = this.props;

    if (currentRegion === null || currentRealm === null || selectedProfession === null) {
      return;
    }

    switch (getProfessionPricelistsLevel) {
      case FetchLevel.success:
        break;
      default:
        return;
    }

    if (expansion_name.length === 0) {
      this.setTitle();

      return;
    }

    if (selectedExpansion === null || selectedExpansion.name !== expansion_name) {
      return;
    }

    this.handleWithExpansion();
  }

  private handleWithExpansion() {
    const {
      routeParams: { pricelist_slug },
      currentRegion,
      currentRealm,
      selectedProfession,
      selectedExpansion,
      selectedList,
      professionPricelists,
      changeSelectedList,
      redirectToPricelist,
    } = this.props;

    if (
      currentRegion === null ||
      currentRealm === null ||
      selectedProfession === null ||
      selectedExpansion === null
    ) {
      return;
    }

    if (
      !(selectedExpansion.name in professionPricelists) ||
      professionPricelists[selectedExpansion.name].length === 0
    ) {
      return;
    }

    if (pricelist_slug.length === 0) {
      const preselectedList: IPricelistJson | null = (() => {
        const sorted = professionPricelists[selectedExpansion.name].sort((a, b) => {
          if (a.pricelist.name === b.pricelist.name) {
            return 0;
          }

          return a.pricelist.name > b.pricelist.name ? 1 : -1;
        });

        return sorted[0].pricelist;
      })();

      if (preselectedList === null) {
        return;
      }

      redirectToPricelist(
        currentRegion,
        currentRealm,
        selectedProfession,
        selectedExpansion,
        preselectedList,
      );

      return;
    }

    const foundList = professionPricelists[selectedExpansion.name].reduce<IPricelistJson | null>(
      (prevValue, curValue) => {
        if (prevValue !== null) {
          return prevValue;
        }

        if (curValue.pricelist.slug === pricelist_slug) {
          return curValue.pricelist;
        }

        return null;
      },
      null,
    );
    if (foundList === null) {
      return;
    }

    if (selectedList === null || foundList.id !== selectedList.id) {
      changeSelectedList(foundList);

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

    if (selectedProfession === null) {
      if (selectedList === null) {
        setTitle(`Professions - ${currentRegion.name.toUpperCase()} ${currentRealm.name}`);

        return;
      }

      const userPricelistTitle = [
        selectedList.name,
        "Professions",
        currentRegion.name.toUpperCase(),
        currentRealm.name,
      ].join(" - ");
      setTitle(userPricelistTitle);

      return;
    }

    if (selectedExpansion === null) {
      setTitle(`
                ${selectedProfession.label} - Professions - ${currentRegion.name.toUpperCase()} ${
        currentRealm.name
      }`);

      return;
    }

    if (selectedList === null) {
      setTitle(`
                ${selectedExpansion.label} - ${
        selectedProfession.label
      } - Professions - ${currentRegion.name.toUpperCase()} ${currentRealm.name}`);

      return;
    }

    const title = [
      selectedList.name,
      selectedExpansion.label,
      selectedProfession.label,
      "Professions",
      currentRegion.name.toUpperCase(),
      currentRealm.name,
    ].join(" - ");
    setTitle(title);
  }
}
