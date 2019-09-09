export * from "./entities";

export interface IDatabaseSettings {
  dbName: string;
  dbHostname: string;
  connectionName: string;
  username: string;
  password: string;
  port: number;
}
