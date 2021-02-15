import { IPricelistEntryJson, ItemId } from "@sotah-inc/core";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Pricelist } from "./pricelist";

@Entity({ name: "pricelist_entries" })
export class PricelistEntry {
  @PrimaryGeneratedColumn()
  public id: number | undefined;

  @ManyToOne(
    () => Pricelist,
    pricelist => pricelist.entries,
  )
  @JoinColumn({ name: "pricelist_id" })
  public pricelist: Pricelist | undefined;

  @Column("int", { name: "item_id" })
  public itemId: ItemId;

  @Column("int", { name: "quantity_modifier" })
  public quantityModifier: number;

  constructor() {
    this.itemId = -1;
    this.quantityModifier = -1;
  }

  public toJson(): IPricelistEntryJson {
    return {
      id: this.id ?? 0,
      item_id: this.itemId,
      quantity_modifier: this.quantityModifier,
    };
  }
}
