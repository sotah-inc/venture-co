import { Connection, createConnection } from "typeorm";

import {
  Post,
  Preference,
  Pricelist,
  PricelistEntry,
  ProfessionPricelist,
  User,
  WorkOrder,
} from "./entities";

export * from "./entities";

export interface IDatabaseSettings {
  dbName: string;
  dbHostname: string;
  connectionName: string;
  username: string;
  password: string;
  port: number;
}

type ConnectDatabaseFn = (opts: IDatabaseSettings) => Promise<Connection>;

export const connectDatabase: ConnectDatabaseFn = async ({
  dbName,
  dbHostname,
  connectionName,
  password,
  port,
  username,
}) => {
  return createConnection({
    database: dbName,
    entities: [Preference, Pricelist, PricelistEntry, ProfessionPricelist, User, Post, WorkOrder],
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
