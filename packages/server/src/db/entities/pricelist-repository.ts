import { AbstractRepository, EntityRepository } from "typeorm";

import { Pricelist } from "./pricelist";
import { ProfessionPricelist } from "./profession-pricelist";

@EntityRepository(Pricelist)
export class PricelistRepository extends AbstractRepository<Pricelist> {
  public async getProfessionPricelist(pricelistId: number): Promise<ProfessionPricelist | null> {
    const pricelist = await this.repository.findOne({
      relations: ["professionPricelist"],
      where: {
        id: pricelistId,
      },
    });
    if (typeof pricelist === "undefined") {
      return null;
    }

    if (typeof pricelist.professionPricelist === "undefined") {
      return null;
    }

    return pricelist.professionPricelist;
  }
}
