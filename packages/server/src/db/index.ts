import { createConnection } from "typeorm";

import { Post, Preference, Pricelist, PricelistEntry, ProfessionPricelist, User } from "./entities";

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
