import React from "react";

import { H2, H4 } from "@blueprintjs/core";
import { IPricelistJson, IRegionComposite, Locale } from "@sotah-inc/core";

import { IGetItemPriceHistoriesOptions } from "../../../../../api/item-price-histories";
import { CurrentPricesTableContainer } from "../../../../../containers/entry-point/PriceLists/PricelistTree/PricelistPanel/PricelistTable/CurrentPricesTable";
import {
  IClientRealm,
  IFetchData,
  IItemsData,
  IPricelistHistoryState,
} from "../../../../../types/global";
import { FetchLevel } from "../../../../../types/main";
import { getItemFromPricelist } from "../../../../../util";
import { ItemIcon } from "../../../../util/ItemIcon";
import { PricelistHistoryGraph } from "../../../../util/PricelistHistoryGraph";

export interface IStateProps {
  pricelistHistory: IFetchData<IItemsData<IPricelistHistoryState>>;
  selectedList: IPricelistJson | null;
  loadId: string;
}

export interface IDispatchProps {
  getPricelistHistory: (opts: IGetItemPriceHistoriesOptions) => void;
}

export interface IOwnProps {
  list: IPricelistJson;
  region: IRegionComposite;
  realm: IClientRealm;
}

type Props = Readonly<IStateProps & IDispatchProps & IOwnProps>;

export class PricelistTable extends React.Component<Props> {
  public componentDidUpdate(prevProps: Readonly<Props>) {
    const { pricelistHistory, getPricelistHistory, region, realm, selectedList } = this.props;

    if (selectedList === null) {
      return;
    }

    if (pricelistHistory.level !== prevProps.pricelistHistory.level) {
      switch (pricelistHistory.level) {
        case FetchLevel.prompted:
          break;
        default:
          return;
      }

      getPricelistHistory({
        itemIds: selectedList.pricelist_entries.map(v => v.item_id),
        locale: Locale.EnUS,
        realmSlug: realm.realm.slug,
        regionName: region.config_region.name,
      });
    }
  }

  public render() {
    const { list, loadId, pricelistHistory } = this.props;

    return (
      <>
        <H2 className="pricelist-table-heading">
          {this.renderPricelistIcon()}
          {list.name}
        </H2>
        <H4>History</H4>
        {
          <PricelistHistoryGraph
            items={pricelistHistory.data.items}
            pricelistHistoryMap={pricelistHistory.data.data.history}
            overallPriceLimits={pricelistHistory.data.data.overallPriceLimits}
            loadId={loadId}
            itemPriceLimits={pricelistHistory.data.data.itemPriceLimits}
          />
        }
        {<CurrentPricesTableContainer />}
      </>
    );
  }

  private renderPricelistIcon() {
    const { list, pricelistHistory } = this.props;

    const item = getItemFromPricelist(pricelistHistory.data.items, list);
    if (item === null) {
      return null;
    }

    return <ItemIcon item={item} />;
  }
}
