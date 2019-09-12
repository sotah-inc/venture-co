import { AbstractRepository, EntityRepository } from "typeorm";

import { ProfessionPricelist } from "./profession-pricelist";

@EntityRepository(ProfessionPricelist)
export class ProfessionPricelistRepository extends AbstractRepository<ProfessionPricelist> {
  public async getFromPricelistId(pricelistId: number): Promise<ProfessionPricelist | null> {
    const professionPricelist = await this.repository
      .createQueryBuilder("profession_pricelist")
      .innerJoinAndSelect(
        "profession_pricelist.pricelist",
        "pricelist",
        "pricelist.id = :pricelist_id",
        { pricelist_id: pricelistId },
      )
      .getOne();

    if (typeof professionPricelist === "undefined") {
      return null;
    }

    return professionPricelist;
  }
}
