import React from "react";

import { H4, Intent, Spinner } from "@blueprintjs/core";
import { IItemPrices, IPricelistJson, IRegionComposite, Locale } from "@sotah-inc/core";

import { IGetPriceListOptions } from "../../../../../../api/data";
import { IClientRealm, IFetchData, IItemsData } from "../../../../../../types/global";
import { FetchLevel } from "../../../../../../types/main";
import { PricesTable } from "../../../../../util/PricesTable";

export interface IStateProps {
  selectedList: IPricelistJson | null;
  priceTable: IFetchData<IItemsData<IItemPrices>>;
  fetchRealmLevel: FetchLevel;
  currentRegion: IRegionComposite | null;
  currentRealm: IClientRealm | null;
}

export interface IDispatchProps {
  getPricelist: (opts: IGetPriceListOptions) => void;
}

type Props = Readonly<IStateProps & IDispatchProps>;

export class CurrentPricesTable extends React.Component<Props> {
  public componentDidUpdate(prevProps: Props) {
    const {
      priceTable: { level },
      selectedList,
      getPricelist,
      currentRegion,
      currentRealm,
    } = this.props;

    if (currentRegion === null || currentRealm === null || selectedList === null) {
      return;
    }

    if (level !== prevProps.priceTable.level) {
      switch (level) {
        case FetchLevel.prompted:
          getPricelist({
            itemIds: selectedList.pricelist_entries.map(v => v.item_id),
            locale: Locale.EnUS,
            realmSlug: currentRealm.realm.slug,
            regionName: currentRegion.config_region.name,
          });

          return;
        default:
          return;
      }
    }
  }

  public render() {
    return (
      <>
        <H4>Current Prices</H4>
        {this.renderContent()}
      </>
    );
  }

  private renderContent() {
    const { fetchRealmLevel } = this.props;

    switch (fetchRealmLevel) {
      case FetchLevel.prompted:
      case FetchLevel.fetching:
      case FetchLevel.refetching:
        return <Spinner intent={Intent.PRIMARY} />;
      case FetchLevel.failure:
        return <Spinner intent={Intent.DANGER} value={1} />;
      case FetchLevel.success:
        return this.renderContentWithRealms();
      case FetchLevel.initial:
      default:
        return <Spinner intent={Intent.NONE} value={0} />;
    }
  }

  private renderContentWithRealms() {
    const {
      priceTable: { level: getPricelistLevel },
    } = this.props;

    switch (getPricelistLevel) {
      case FetchLevel.fetching:
        return <Spinner intent={Intent.PRIMARY} />;
      case FetchLevel.failure:
        return <Spinner intent={Intent.DANGER} value={1} />;
      case FetchLevel.success:
        return this.renderTable();
      case FetchLevel.initial:
      default:
        return <Spinner intent={Intent.NONE} value={1} />;
    }
  }

  private renderTable() {
    const { selectedList, priceTable } = this.props;

    if (selectedList === null) {
      return null;
    }

    return <PricesTable entryRows={selectedList.pricelist_entries} priceTable={priceTable} />;
  }
}
