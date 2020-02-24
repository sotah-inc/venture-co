import React from "react";

import { Classes, HTMLTable } from "@blueprintjs/core";
import { IQueryWorkOrdersResponse, IWorkOrderJson } from "@sotah-inc/core";

import { IFetchData } from "../../../types/global";
import { FetchLevel } from "../../../types/main";

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
            <th>Id</th>
            <th>Region</th>
            <th>Realm</th>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Recipient</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>{orders.data.orders.map(v => this.renderOrder(v))}</tbody>
      </HTMLTable>
    );
  }

  private renderOrder(order: IWorkOrderJson) {
    return (
      <tr>
        <th>{order.id}</th>
        <td>{order.region_name.toUpperCase()}</td>
        <td>{order.realm_slug}</td>
        <td>{order.item_id}</td>
        <td>{order.quantity}</td>
        <td>{order.price}</td>
        <td>{order.user_id}</td>
        <td>{order.created_at}</td>
      </tr>
    );
  }
}
