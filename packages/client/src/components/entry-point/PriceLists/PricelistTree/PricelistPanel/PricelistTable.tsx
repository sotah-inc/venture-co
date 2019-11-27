import React from "react";

import { H2, H4 } from "@blueprintjs/core";
import { IItemsMap, IPricelistJson, IRegion, IStatusRealm } from "@sotah-inc/core";

// tslint:disable-next-line:max-line-length
import { CurrentPricesTableContainer } from "../../../../../containers/entry-point/PriceLists/PricelistTree/PricelistPanel/PricelistTable/CurrentPricesTable";
// tslint:disable-next-line:max-line-length
import { CurrentSellersTableContainer } from "../../../../../containers/entry-point/PriceLists/PricelistTree/PricelistPanel/PricelistTable/CurrentSellersTable";
// tslint:disable-next-line:max-line-length
import { PricelistHistoryGraphContainer } from "../../../../../containers/util/PricelistHistoryGraph";
import { PricelistIconContainer } from "../../../../../containers/util/PricelistIcon";

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
          <PricelistIconContainer pricelist={list} />
          {list.name}
        </H2>
        <H4>History</H4>
        {<PricelistHistoryGraphContainer itemIds={itemIds} region={region} realm={realm} />}
        {<CurrentPricesTableContainer list={list} region={region} realm={realm} />}
        {<CurrentSellersTableContainer list={list} region={region} realm={realm} />}
      </>
    );
  }
}
