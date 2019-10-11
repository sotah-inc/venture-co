import { Firestore } from "@google-cloud/firestore";
import { getEnvVar } from "@sotah-inc/core";

const isGceEnv = getEnvVar("IS_GCE_ENV") === "1";

// optionally loading firestore
const firestoreDb: Firestore | null = isGceEnv ? new Firestore() : null;

const getConnectionField = async (
  documentFieldName: string,
  defaultValue?: string,
): Promise<string> => {
  if (firestoreDb === null) {
    return defaultValue || "";
  }

  const doc = await firestoreDb
    .collection("connection_info")
    .doc("current")
    .get();
  const data = doc.data();
  if (typeof data === "undefined") {
    return defaultValue || "";
  }
  if (!(documentFieldName in data)) {
    return defaultValue || "";
  }

  return data[documentFieldName];
};

export const getConfig = async (documentFieldName: string, envVarName: string): Promise<string> => {
  if (firestoreDb === null) {
    return getEnvVar(envVarName);
  }

  return getConnectionField(documentFieldName, getEnvVar(envVarName));
};
