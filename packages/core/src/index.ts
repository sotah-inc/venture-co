import process from "process";
import { zeroGraphValue } from "../../client/src/util";

export * from "./types";

export const getEnvVar = (envVarName: string): string => {
  const envVar = process.env[envVarName];
  if (typeof envVar === "undefined") {
    return "";
  }

  return envVar;
};

export interface ILimits {
  lower: number;
  upper: number;
}

export function normalizeLimits(input: ILimits): ILimits {
  const nextOverallLower = Math.pow(10, Math.floor(Math.log10(input.lower)));

  return {
    lower: nextOverallLower === 0 ? zeroGraphValue : nextOverallLower,
    upper: Math.pow(10, Math.ceil(Math.log10(input.upper))),
  };
}
