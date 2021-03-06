import { ExpansionName, ProfessionId } from "@sotah-inc/core";
import { AbstractRepository, EntityRepository } from "typeorm";

import { ProfessionPricelist } from "./profession-pricelist";

@EntityRepository(ProfessionPricelist)
export class ProfessionPricelistRepository extends AbstractRepository<ProfessionPricelist> {
  public async getFromPricelistId(pricelistId: number): Promise<ProfessionPricelist | null> {
    const queryBuilder = this.repository
      .createQueryBuilder("profession_pricelist")
      .innerJoinAndSelect(
        "profession_pricelist.pricelist",
        "pricelist",
        "pricelist.id = :pricelist_id",
        { pricelist_id: pricelistId },
      )
      .innerJoinAndSelect("pricelist.user", "pricelist.user")
      .innerJoinAndSelect("pricelist.entries", "pricelist.entries");

    const professionPricelist = await queryBuilder.getOne();

    if (typeof professionPricelist === "undefined") {
      return null;
    }

    return professionPricelist;
  }

  public async getFromPricelistSlug(
    professionId: ProfessionId,
    expansion: ExpansionName,
    slug: string,
  ): Promise<ProfessionPricelist | null> {
    const queryBuilder = this.repository
      .createQueryBuilder("profession_pricelist")
      .innerJoinAndSelect("profession_pricelist.pricelist", "pricelist")
      .innerJoinAndSelect("pricelist.user", "user")
      .innerJoinAndSelect("pricelist.entries", "entry")
      .where("profession_pricelist.professionId = :professionId")
      .andWhere("profession_pricelist.expansion = :expansion")
      .andWhere("pricelist.slug = :slug")
      .setParameters({ professionId, expansion, slug });

    const professionPricelist = await queryBuilder.getOne();

    if (typeof professionPricelist === "undefined") {
      return null;
    }

    return professionPricelist;
  }
}
