import { createConnection } from "typeorm";

import { Post } from "../../../api/src/entities/post";
import { Preference } from "../../../api/src/entities/preference";
import { Pricelist } from "../../../api/src/entities/pricelist";
import { PricelistEntry } from "../../../api/src/entities/pricelist-entry";
import { ProfessionPricelist } from "../../../api/src/entities/profession-pricelist";
import { User } from "../../../api/src/entities/user";
export * from "./entities";

export interface IDatabaseSettings {
  dbName: string;
  dbHostname: string;
  connectionName: string;
  username: string;
  password: string;
  port: number;
}

export const connectDatabase = ({
  dbName,
  dbHostname,
  connectionName,
  password,
  port,
  username,
}: IDatabaseSettings) => {
  return createConnection({
    database: dbName,
    entities: [Preference, Pricelist, PricelistEntry, ProfessionPricelist, User, Post],
    host: dbHostname,
    logging: false,
    name: connectionName,
    password,
    port,
    synchronize: false,
    type: "postgres",
    username,
  });
};
