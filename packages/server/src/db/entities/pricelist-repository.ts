import { AbstractRepository, EntityRepository } from "typeorm";

import { Pricelist } from "./pricelist";

@EntityRepository(Pricelist)
export class PricelistRepository extends AbstractRepository<Pricelist> {
  public async getBelongingToUserById(id: number, userId: number): Promise<Pricelist | null> {
    const pricelist = await this.repository
      .createQueryBuilder("pricelist")
      .innerJoinAndSelect("pricelist.user", "user", "user.id = :user_id", { user_id: userId })
      .where({ id })
      .getOne();

    if (typeof pricelist === "undefined") {
      return null;
    }

    return pricelist;
  }
}
