import React from "react";

import { H2, H4 } from "@blueprintjs/core";
import { IItemsMap, IPricelistJson, IRegion, IStatusRealm } from "@sotah-inc/core";

// tslint:disable-next-line:max-line-length
import { CurrentPricesTableContainer } from "../../../../../containers/entry-point/PriceLists/PricelistTree/PricelistPanel/PricelistTable/CurrentPricesTable";
// tslint:disable-next-line:max-line-length
import { CurrentSellersTableContainer } from "../../../../../containers/entry-point/PriceLists/PricelistTree/PricelistPanel/PricelistTable/CurrentSellersTable";
import { getItemFromPricelist } from "../../../../../util";
import { ItemIcon } from "../../../../util/ItemIcon";
import { PricelistHistoryGraph } from "../../../../util/PricelistHistoryGraph";

export interface IStateProps {
  items: IItemsMap;
}

export interface IOwnProps {
  list: IPricelistJson;
  region: IRegion;
  realm: IStatusRealm;
}

type Props = Readonly<IStateProps & IOwnProps>;

export class PricelistTable extends React.Component<Props> {
  public render() {
    const { list, region, realm } = this.props;

    const itemIds = list.pricelist_entries.map(v => v.item_id);

    return (
      <>
        <H2 className="pricelist-table-heading">
          {this.renderPricelistIcon()}
          {list.name}
        </H2>
        <H4>History</H4>
        {<PricelistHistoryGraph itemIds={itemIds} region={region} realm={realm} />}
        {<CurrentPricesTableContainer list={list} region={region} realm={realm} />}
        {<CurrentSellersTableContainer list={list} region={region} realm={realm} />}
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
