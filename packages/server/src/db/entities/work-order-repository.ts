import {
  ConnectedRealmId,
  GameVersion,
  OrderDirection,
  OrderKind,
  RegionName,
} from "@sotah-inc/core";
import { AbstractRepository, EntityRepository } from "typeorm";
import { FindManyOptions } from "typeorm/find-options/FindManyOptions";

import { WorkOrder } from "./work-order";

export interface IFindByOptions {
  regionName: RegionName;
  connectedRealmId: ConnectedRealmId;
  perPage: number;
  page: number;
  orderBy: OrderKind;
  orderDirection: OrderDirection;
  gameVersion: GameVersion;
}

@EntityRepository(WorkOrder)
export class WorkOrderRepository extends AbstractRepository<WorkOrder> {
  public async findBy({
    connectedRealmId,
    regionName,
    perPage,
    page,
    orderBy,
    orderDirection,
    gameVersion,
  }: IFindByOptions): Promise<{ orders: WorkOrder[]; count: number }> {
    const mainOptions: FindManyOptions<WorkOrder> = {
      where: { regionName, connectedRealmId, gameVersion },
    };

    const count = await this.repository.count(mainOptions);
    const orders = await this.repository.find({
      ...mainOptions,
      order: { [orderBy]: orderDirection },
      skip: perPage * (page - 1),
      take: perPage,
    });

    return { orders, count };
  }
}
