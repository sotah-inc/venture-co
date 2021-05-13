import { ConnectedRealmId, GameVersion, ItemId, IWorkOrderJson, RegionName } from "@sotah-inc/core";
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
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

  @ManyToOne(() => User, user => user.workOrders, { eager: true })
  @JoinColumn({ name: "user_id" })
  public user: User | undefined;

  @Column("varchar", { length: 255, name: "game_version" })
  @Index("idx_game_version")
  public gameVersion: GameVersion;

  @Column("varchar", { length: 255, name: "region_name" })
  @Index("idx_region_name")
  public regionName: RegionName;

  @Column("int", { name: "connected_realm_id" })
  @Index("idx_connected_realm_id")
  public connectedRealmId: ConnectedRealmId;

  @Column({ type: "int", name: "item_id" })
  @Index("idx_item_id")
  public itemId: ItemId;

  @Column({ type: "int" })
  public quantity: number;

  @Column({ type: "int" })
  public price: number;

  @CreateDateColumn({ name: "created_at" })
  @Index("idx_created_at")
  public createdAt: Date | undefined;

  @UpdateDateColumn({ name: "updated_at" })
  @Index("idx_updated_at")
  public updatedAt: Date | undefined;

  constructor() {
    this.gameVersion = GameVersion.Retail;
    this.connectedRealmId = -1;
    this.regionName = "";
    this.itemId = -1;
    this.quantity = -1;
    this.price = -1;
  }

  public toJson(): IWorkOrderJson {
    return {
      connected_realm_id: this.connectedRealmId,
      created_at: (this.createdAt?.getTime() ?? 0) / 1000,
      game_version: this.gameVersion,
      id: this?.id ?? 0,
      item_id: this.itemId,
      price: this.price,
      quantity: this.quantity,
      region_name: this.regionName,
      updated_at: (this.updatedAt?.getTime() ?? 0) / 1000,
      user_id: this.user?.id ?? "",
    };
  }
}
