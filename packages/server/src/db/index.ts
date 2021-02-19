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

export async function connectDatabase({
  dbName,
  dbHostname,
  connectionName,
  password,
  port,
  username,
}: IDatabaseSettings): Promise<Connection> {
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
}
