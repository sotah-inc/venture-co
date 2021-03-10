import { IUserJson, UserLevel } from "@sotah-inc/core";
import * as jwt from "jsonwebtoken";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { GeneralMessenger } from "../../messenger";
import { getJwtOptions } from "../../session";
import { Post } from "./post";
import { Preference } from "./preference";
import { Pricelist } from "./pricelist";
import { WorkOrder } from "./work-order";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  public id: number | undefined;

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

  @Column({ nullable: false, unique: true })
  public email: string;

  @Column({ name: "hashed_password", nullable: false })
  public hashedPassword: string;

  @Column("int", { default: UserLevel.Unverified, nullable: false })
  public level: UserLevel;

  @OneToMany(
    () => WorkOrder,
    workOrder => workOrder.user,
  )
  public workOrders: WorkOrder[] | undefined;

  constructor() {
    this.email = "";
    this.hashedPassword = "";
    this.level = UserLevel.Unverified;
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
      email: this.email,
      id: this.id ?? 0,
      level: this.level,
    };
  }
}
