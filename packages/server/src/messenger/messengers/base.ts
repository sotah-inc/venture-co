import { NatsConnection } from "nats";
import * as nats from "nats";

import { code } from "../contracts";
import { Message, ParseKind } from "../message";
import { MessageError } from "../message-error";

const DEFAULT_TIMEOUT = 5 * 1000;

export interface IMessage {
  data: string;
  error: string;
  code: number;
}

interface IRequestOptions {
  body?: string;
  parseKind?: ParseKind;
  timeout?: number;
}

interface IDefaultRequestOptions {
  body: string;
  parseKind: ParseKind;
  timeout: number;
}

export abstract class BaseMessenger {
  protected client: nats.NatsConnection;

  constructor(client: nats.NatsConnection) {
    this.client = client;
  }

  protected async request<T>(subject: string, opts?: IRequestOptions): Promise<Message<T>> {
    const { body, parseKind, timeout }: IDefaultRequestOptions = {
      body: "",
      parseKind: ParseKind.JsonEncoded,
      timeout: DEFAULT_TIMEOUT,
      ...opts,
    };

    const msg: Promise<nats.Msg> = await Promise.race([
      this.client.request(subject, Buffer.from(body)),
      new Promise((_resolve,reject) => setTimeout(() => reject(new Error("Timed out!")), timeout)),
    ]);

    return new Promise<Message<T>>((resolve, reject) => {
      const tId = setTimeout(() => reject(new Error("Timed out!")), timeout);

      this.client.request(subject, body, (natsMsg: string) => {
        (async () => {
          clearTimeout(tId);
          const parsedMsg: IMessage = JSON.parse(natsMsg.toString());
          const msg = new Message<T>(parsedMsg, parseKind);
          if (msg.error !== null && msg.code === code.genericError) {
            const reason: MessageError = {
              code: msg.code,
              message: msg.error.message,
            };
            reject(reason);

            return;
          }

          resolve(msg);
        })();
      });
    });
  }
}
