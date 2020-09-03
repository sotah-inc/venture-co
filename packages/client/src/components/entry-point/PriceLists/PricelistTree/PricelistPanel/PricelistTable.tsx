import React from "react";

import { H2, H4 } from "@blueprintjs/core";
import {
  IItem,
  IItemPriceLimits,
  IItemPricelistHistoryMap,
  IPriceLimits,
  IPricelistJson,
  IPricesFlagged,
  IRegionComposite,
} from "@sotah-inc/core";

// tslint:disable-next-line:max-line-length
import { CurrentPricesTableContainer } from "../../../../../containers/entry-point/PriceLists/PricelistTree/PricelistPanel/PricelistTable/CurrentPricesTable";
import { IClientRealm } from "../../../../../types/global";
import { getItemFromPricelist } from "../../../../../util";
import { ItemIcon } from "../../../../util/ItemIcon";
import { PricelistHistoryGraph } from "../../../../util/PricelistHistoryGraph";

export interface IStateProps {
  items: IItem[];
  pricelistHistoryMap: IItemPricelistHistoryMap<IPricesFlagged>;
  overallPriceLimits: IPriceLimits;
  itemPriceLimits: IItemPriceLimits;
  loadId: string;
}

export interface IOwnProps {
  list: IPricelistJson;
  region: IRegionComposite;
  realm: IClientRealm;
}

type Props = Readonly<IStateProps & IOwnProps>;

export class PricelistTable extends React.Component<Props> {
  public render() {
    const {
      list,
      region,
      realm,
      items,
      pricelistHistoryMap,
      overallPriceLimits,
      loadId,
      itemPriceLimits,
    } = this.props;

    return (
      <>
        <H2 className="pricelist-table-heading">
          {this.renderPricelistIcon()}
          {list.name}
        </H2>
        <H4>History</H4>
        {
          <PricelistHistoryGraph
            items={items}
            pricelistHistoryMap={pricelistHistoryMap}
            overallPriceLimits={overallPriceLimits}
            loadId={loadId}
            itemPriceLimits={itemPriceLimits}
          />
        }
        {<CurrentPricesTableContainer list={list} region={region} realm={realm} />}
      </>
    );
  }

  private renderPricelistIcon() {
    const { items, list } = this.props;

    const item = getItemFromPricelist(items, list);
    if (item === null) {
      return null;
    }

    return <ItemIcon item={item} />;
  }
}
