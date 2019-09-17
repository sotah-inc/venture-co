import process from "process";

export * from "./types";

export const getEnvVar = (envVarName: string): string => {
  const envVar = process.env[envVarName];
  if (typeof envVar === "undefined") {
    return "";
  }

  return envVar;
};
