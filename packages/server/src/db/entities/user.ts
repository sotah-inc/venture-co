import { IUserJson, UserLevel } from "@sotah-inc/core";
import * as jwt from "jsonwebtoken";
import { Column, Entity, Index, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { GeneralMessenger } from "../../messenger";
import { getJwtOptions } from "../../session";
import { Post } from "./post";
import { Preference } from "./preference";
import { Pricelist } from "./pricelist";
import { WorkOrder } from "./work-order";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column("int", { default: UserLevel.Unverified, nullable: false })
  @Index("idx_user_level")
  public level: UserLevel;

  @Column("string", { nullable: false })
  @Index("idx_firebase_id")
  public firebaseUid: string;

  @OneToOne(
    () => Preference,
    preference => preference.user,
  )
  public preference: Preference | undefined;

  @OneToMany(
    () => Pricelist,
    pricelist => pricelist.user,
  )
  public pricelists: Pricelist[] | undefined;

  @OneToMany(
    () => Post,
    post => post.user,
  )
  public posts: Post[] | undefined;

  @OneToMany(
    () => WorkOrder,
    workOrder => workOrder.user,
  )
  public workOrders: WorkOrder[] | undefined;

  constructor() {
    this.id = "";
    this.level = UserLevel.Unverified;
    this.firebaseUid = "";
  }

  public async generateJwtToken(generalMessenger: GeneralMessenger): Promise<string> {
    const jwtOptions = await getJwtOptions(generalMessenger);

    return jwt.sign({ data: this.id }, jwtOptions.secret, {
      algorithm: "HS512",
      audience: jwtOptions.audience,
      issuer: jwtOptions.issuer,
    });
  }

  public toJson(): IUserJson {
    return {
      id: this.id,
      level: this.level,
      firebaseUid: this.firebaseUid,
    };
  }
}
