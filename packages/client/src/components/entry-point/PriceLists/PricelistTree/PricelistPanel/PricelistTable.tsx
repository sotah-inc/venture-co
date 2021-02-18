import React from "react";

import { H2, H4 } from "@blueprintjs/core";
import { IPricelistJson, IRegionComposite, Locale } from "@sotah-inc/core";

import { IGetItemPriceHistoriesOptions } from "../../../../../api/item-price-histories";
import { CurrentPricesTableContainer } from "../../../../../containers/entry-point/PriceLists/PricelistTree/PricelistPanel/PricelistTable/CurrentPricesTable";
import {
  IClientRealm,
  IFetchData,
  IItemPriceHistoriesState,
  IItemsData,
} from "../../../../../types/global";
import { FetchLevel } from "../../../../../types/main";
import { getItemFromPricelist } from "../../../../../util";
import { ItemIcon } from "../../../../util/ItemIcon";
import { ItemPriceHistoriesGraph } from "../../../../util/ItemPriceHistoriesGraph";

export interface IStateProps {
  itemPriceHistories: IFetchData<IItemsData<IItemPriceHistoriesState>>;
  selectedList: IPricelistJson | null;
  loadId: string;
}

export interface IDispatchProps {
  getItemPriceHistories: (opts: IGetItemPriceHistoriesOptions) => void;
}

export interface IOwnProps {
  list: IPricelistJson;
  region: IRegionComposite;
  realm: IClientRealm;
}

type Props = Readonly<IStateProps & IDispatchProps & IOwnProps>;

export class PricelistTable extends React.Component<Props> {
  public componentDidUpdate(prevProps: Readonly<Props>) {
    const { itemPriceHistories, getItemPriceHistories, region, realm, selectedList } = this.props;

    if (selectedList === null) {
      return;
    }

    if (itemPriceHistories.level !== prevProps.itemPriceHistories.level) {
      switch (itemPriceHistories.level) {
      case FetchLevel.prompted:
        break;
      default:
        return;
      }

      getItemPriceHistories({
        itemIds: selectedList.pricelist_entries.map(v => v.item_id),
        locale: Locale.EnUS,
        realmSlug: realm.realm.slug,
        regionName: region.config_region.name,
      });
    }
  }

  public render(): React.ReactNode {
    const { list, loadId, itemPriceHistories } = this.props;

    return (
      <>
        <H2 className="pricelist-table-heading">
          {this.renderPricelistIcon()}
          {list.name}
        </H2>
        <H4>History</H4>
        {
          <ItemPriceHistoriesGraph
            items={itemPriceHistories.data.items}
            itemPriceHistories={itemPriceHistories.data.data.history}
            loadId={loadId}
          />
        }
        {<CurrentPricesTableContainer />}
      </>
    );
  }

  private renderPricelistIcon() {
    const { list, itemPriceHistories } = this.props;

    const item = getItemFromPricelist(itemPriceHistories.data.items, list);
    if (item === null) {
      return null;
    }

    return <ItemIcon item={item} />;
  }
}
