import { ExpansionName, IProfessionPricelistJson } from "@sotah-inc/core";
import { Column, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { Pricelist } from "./pricelist";

@Entity({ name: "profession_pricelists" })
export class ProfessionPricelist {
  @PrimaryGeneratedColumn()
  public id: number | undefined;

  @OneToOne(
    () => Pricelist,
    pricelist => pricelist.professionPricelist,
    {
      eager: true,
    },
  )
  @JoinColumn({ name: "pricelist_id" })
  public pricelist: Pricelist | undefined;

  @Column("int", { name: "profession_id" })
  @Index("idx_profession_id")
  public professionId: number;

  @Column("varchar", { length: 255 })
  public expansion: ExpansionName;

  constructor() {
    this.professionId = -1;
    this.expansion = "";
  }

  public toJson(): IProfessionPricelistJson {
    return {
      expansion: this.expansion,
      id: this.id ?? 0,
      professionId: this.professionId,
      pricelist: this.pricelist?.toJson() ?? { name: "", id: 0, pricelist_entries: [], slug: null },
    };
  }
}
