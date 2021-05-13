import { AbstractRepository, EntityRepository } from "typeorm";

import { Pricelist } from "./pricelist";

@EntityRepository(Pricelist)
export class PricelistRepository extends AbstractRepository<Pricelist> {
  public async getBelongingToUserById(id: number, userId: string): Promise<Pricelist | null> {
    const pricelist = await this.repository
      .createQueryBuilder("pricelist")
      .innerJoinAndSelect("pricelist.user", "user", "user.id = :user_id", { user_id: userId })
      .innerJoinAndSelect("pricelist.entries", "entries")
      .where({ id })
      .getOne();

    if (typeof pricelist === "undefined") {
      return null;
    }

    return pricelist;
  }

  public async getFromPricelistSlug(userId: string, slug: string): Promise<Pricelist | null> {
    const queryBuilder = this.repository
      .createQueryBuilder("pricelist")
      .where({ slug })
      .innerJoinAndSelect("pricelist.user", "user", "user.id = :user_id", { user_id: userId })
      .innerJoinAndSelect("pricelist.entries", "pricelist.entries");

    const pricelist = await queryBuilder.getOne();

    if (typeof pricelist === "undefined") {
      return null;
    }

    return pricelist;
  }

  public async removeByUserId(id: number, userId: string): Promise<boolean> {
    const pricelist = await this.getBelongingToUserById(id, userId);
    if (pricelist === null) {
      return false;
    }

    await Promise.all((pricelist.entries ?? []).map(v => this.manager.remove(v)));
    await this.manager.remove(pricelist);

    return true;
  }

  public async getAllUserPricelists(userId: string): Promise<Pricelist[]> {
    return this.createQueryBuilder("pricelist")
      .innerJoinAndSelect("pricelist.user", "user", "user.id = :user_id", { user_id: userId })
      .innerJoinAndSelect("pricelist.entries", "entries")
      .leftJoinAndSelect("pricelist.professionPricelist", "professionPricelist")
      .getMany();
  }
}
