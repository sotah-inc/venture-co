import { RealmSlug, RegionName } from "@sotah-inc/core";
import { AbstractRepository, EntityRepository } from "typeorm";

import { WorkOrder } from "./work-order";

export interface IFindByOptions {
  regionName: RegionName;
  realmSlug: RealmSlug;
  perPage: number;
  page: number;
  orderBy: OrderBy;
}

export enum OrderBy {
  CreatedAt = "createdAt",
}

@EntityRepository(WorkOrder)
export class WorkOrderRepository extends AbstractRepository<WorkOrder> {
  public async findBy({
    regionName,
    realmSlug,
    perPage,
    page,
    orderBy,
  }: IFindByOptions): Promise<WorkOrder[]> {
    if (!(orderBy in OrderBy)) {
      throw new Error("Invalid order-by");
    }

    return this.repository.find({
      order: { [orderBy]: "DESC" },
      skip: perPage * page,
      take: perPage,
      where: { regionName, realmSlug },
    });
  }
}
