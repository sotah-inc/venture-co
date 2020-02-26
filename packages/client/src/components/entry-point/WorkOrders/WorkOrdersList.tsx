import React from "react";

import { Classes, HTMLTable, Position, Tooltip } from "@blueprintjs/core";
import { IQueryWorkOrdersResponse, ItemId, IWorkOrderJson } from "@sotah-inc/core";
import moment from "moment-timezone";

import { ItemPopoverContainer } from "../../../containers/util/ItemPopover";
import { IFetchData } from "../../../types/global";
import { FetchLevel } from "../../../types/main";
import { Currency } from "../../util";

export interface IStateProps {
  orders: IFetchData<IQueryWorkOrdersResponse>;
}

type Props = Readonly<IStateProps>;

export class WorkOrdersList extends React.Component<Props> {
  public render() {
    const { orders } = this.props;

    switch (orders.level) {
      case FetchLevel.success:
        break;
      case FetchLevel.failure:
        return <p>Failed to render work-orders!</p>;
      case FetchLevel.initial:
      default:
        return <p>Loading...</p>;
    }

    const classNames = [
      Classes.HTML_TABLE,
      Classes.HTML_TABLE_BORDERED,
      Classes.SMALL,
      "auction-table",
    ];

    return (
      <HTMLTable className={classNames.join(" ")}>
        <thead>
          <tr>
            <th>Item</th>
            <th>Price</th>
            <th>Recipient Id</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>{orders.data.orders.map((v, i) => this.renderOrder(v, i))}</tbody>
      </HTMLTable>
    );
  }

  private renderOrder(order: IWorkOrderJson, i: number) {
    return (
      <tr key={i}>
        <td>{this.renderItem(order.item_id, order.quantity)}</td>
        <td>
          <Currency amount={order.price} />
        </td>
        <td>{order.user_id}</td>
        <td>{this.renderCreatedAt(order.created_at)}</td>
      </tr>
    );
  }

  private renderCreatedAt(createdAt: number) {
    const foundDate = moment(createdAt * 1000)
      .utc(true)
      .tz(moment.tz.guess());

    return (
      <Tooltip
        position={Position.LEFT}
        inheritDarkTheme={true}
        content={foundDate.format("MMMM Do YYYY, h:mm:ss a Z")}
      >
        {foundDate.fromNow()}
      </Tooltip>
    );
  }

  private renderItem(itemId: ItemId, quantity: number) {
    const { orders } = this.props;

    if (!(itemId in orders.data.items)) {
      return itemId;
    }

    return (
      <ItemPopoverContainer
        item={orders.data.items[itemId]}
        itemTextFormatter={v => `${v} x${quantity}`}
      />
    );
  }
}
