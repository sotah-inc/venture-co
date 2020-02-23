import { GameVersion, OrderDirection, OrderKind, RealmSlug, RegionName } from "@sotah-inc/core";
import { AbstractRepository, EntityRepository } from "typeorm";
// tslint:disable-next-line:no-submodule-imports
import { FindManyOptions } from "typeorm/find-options/FindManyOptions";

import { WorkOrder } from "./work-order";

export interface IFindByOptions {
  regionName: RegionName;
  realmSlug: RealmSlug;
  perPage: number;
  page: number;
  orderBy: OrderKind;
  orderDirection: OrderDirection;
  gameVersion: GameVersion;
}

@EntityRepository(WorkOrder)
export class WorkOrderRepository extends AbstractRepository<WorkOrder> {
  public async findBy({
    regionName,
    realmSlug,
    perPage,
    page,
    orderBy,
    orderDirection,
    gameVersion,
  }: IFindByOptions) {
    const mainOptions: FindManyOptions<WorkOrder> = {
      where: { regionName, realmSlug, gameVersion },
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
