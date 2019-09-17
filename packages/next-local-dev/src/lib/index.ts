import { getEnvVar } from "@sotah-inc/core";
import { Messenger } from "@sotah-inc/server";
import * as nats from "nats";

const getNatsClient = async (natsHost: string, natsPort: string): Promise<nats.Client> => {
  const conn = nats.connect({
    maxReconnectAttempts: 5,
    reconnectTimeWait: 100,
    url: `nats://${natsHost}:${natsPort}`,
  });
  return new Promise<nats.Client | null>((resolve, reject) => {
    conn.on("connect", () => resolve(conn));
    conn.on("error", reject);
  });
};

let messengerClient: Messenger | null = null;

export const getMessengerClient = async (): Promise<Messenger> => {
  if (messengerClient !== null) {
    return messengerClient;
  }

  const natsHost = getEnvVar("NATS_HOST");
  if (natsHost.length === 0) {
    throw new Error("NATS_HOST was blank");
  }

  const natsPort = getEnvVar("NATS_PORT");
  if (natsPort.length === 0) {
    throw new Error("NATS_PORT was blank");
  }

  messengerClient = new Messenger(await getNatsClient(natsHost, natsPort));

  return messengerClient;
};
