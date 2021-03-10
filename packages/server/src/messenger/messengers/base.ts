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
  protected client: nats.Client;

  constructor(client: nats.Client) {
    this.client = client;
  }

  protected request<T>(subject: string, opts?: IRequestOptions): Promise<Message<T>> {
    const { body, parseKind, timeout }: IDefaultRequestOptions = {
      body: "",
      parseKind: ParseKind.JsonEncoded,
      timeout: DEFAULT_TIMEOUT,
      ...opts,
    };

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
