import { AbstractRepository, EntityRepository } from "typeorm";

import { Preference } from "./preference";

@EntityRepository(Preference)
export class PreferenceRepository extends AbstractRepository<Preference> {
  public async getFromUserId(userId: string): Promise<Preference | null> {
    const preference = await this.repository
      .createQueryBuilder("preference")
      .innerJoinAndSelect("preference.user", "user", "user.id = :user_id", { user_id: userId })
      .getOne();

    if (typeof preference === "undefined") {
      return null;
    }

    return preference;
  }
}
