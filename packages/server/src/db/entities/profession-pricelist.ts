import { ExpansionName, IProfessionPricelistJson, ProfessionName } from "@sotah-inc/core";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

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

  @Column("varchar", { length: 255 })
  public name: ProfessionName;

  @Column("varchar", { length: 255 })
  public expansion: ExpansionName;

  constructor() {
    this.name = "";
    this.expansion = "";
  }

  public toJson(): IProfessionPricelistJson {
    return {
      expansion: this.expansion,
      id: this.id ?? 0,
      name: this.name,
      pricelist: this.pricelist?.toJson() ?? { name: "", id: 0, pricelist_entries: [], slug: null },
    };
  }
}
