import process from "process";

export * from "./types";

export function getEnvVar(envVarName: string): string {
  const envVar = process.env[envVarName];
  if (typeof envVar === "undefined") {
    return "";
  }

  return envVar;
}

export interface ILimits {
  lower: number;
  upper: number;
}

export function normalizeLimits(input: ILimits): ILimits {
  return {
    lower: Math.pow(10, Math.floor(Math.log10(input.lower))),
    upper: Math.pow(10, Math.ceil(Math.log10(input.upper))),
  };
}

export enum LogLevel {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
  SILENT = 5,
}
