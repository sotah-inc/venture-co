import { ItemId, IWorkOrderJson, RealmSlug, RegionName } from "@sotah-inc/core";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { User } from "./user";

@Entity({ name: "work_orders" })
export class WorkOrder {
  @PrimaryGeneratedColumn()
  public id: number | undefined;

  @ManyToOne(
    () => User,
    user => user.workOrders,
    { eager: true },
  )
  @JoinColumn({ name: "user_id" })
  public user: User | undefined;

  @Column("varchar", { length: 255 })
  public regionName: RegionName;

  @Column("varchar", { length: 255 })
  public realmSlug: RealmSlug;

  @Column({ type: "int", name: "item_id" })
  public itemId: ItemId;

  @Column({ type: "int" })
  public quantity: number;

  @Column({ type: "int" })
  public price: number;

  @CreateDateColumn({ name: "created_at" })
  public createdAt: Date | undefined;

  @UpdateDateColumn({ name: "updated_at" })
  public updatedAt: Date | undefined;

  constructor() {
    this.realmSlug = "";
    this.regionName = "";
    this.itemId = -1;
    this.quantity = -1;
    this.price = -1;
  }

  public toJson(): IWorkOrderJson {
    return {
      created_at: this.createdAt!.getTime() / 1000,
      id: this.id!,
      item_id: this.itemId,
      price: this.price,
      quantity: this.quantity,
      realm_slug: this.realmSlug,
      region_name: this.regionName,
      updated_at: this.updatedAt!.getTime() / 1000,
      user_id: this.user!.id!,
    };
  }
}
