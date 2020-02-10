import { GameVersion, RealmSlug, RegionName } from "@sotah-inc/core";
import { AbstractRepository, EntityRepository } from "typeorm";

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

export enum OrderKind {
  CreatedAt = "createdAt",
}

export enum OrderDirection {
  Asc = "ASC",
  Desc = "DESC",
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
  }: IFindByOptions): Promise<WorkOrder[]> {
    return this.repository.find({
      order: { [orderBy]: orderDirection },
      skip: perPage * page,
      take: perPage,
      where: { regionName, realmSlug, gameVersion },
    });
  }
}
