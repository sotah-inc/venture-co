import { Msg, NatsConnection } from "nats";

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

function isNatsMessage(v: unknown): v is Msg {
  return (v as Msg).subject !== undefined;
}

export abstract class BaseMessenger {
  protected conn: NatsConnection;

  constructor(conn: NatsConnection) {
    this.conn = conn;
  }

  protected async request<T>(subject: string, opts?: IRequestOptions): Promise<Message<T>> {
    const { body, parseKind, timeout }: IDefaultRequestOptions = {
      body: "",
      parseKind: ParseKind.JsonEncoded,
      timeout: DEFAULT_TIMEOUT,
      ...opts,
    };

    const natsMessage = await Promise.race([
      this.conn.request(subject, Buffer.from(body)),
      new Promise((_resolve,reject) => setTimeout(() => reject(new Error("Timed out!")), timeout)),
    ]);
    if (!isNatsMessage(natsMessage)) {
      throw new Error("failed to resolve nats message");
    }

    const messageText = natsMessage.data.toString();

    let parsedMsg: IMessage;
    try {
      parsedMsg = JSON.parse(messageText);
    } catch (err) {
      console.error("failed to decode message", {
        messageBody: messageText.substr(0, 100),
        err: err.message,
      });

      const reason = new MessageError(err.message);
      reason.code = code.msgJsonParseError;

      throw reason;
    }

    const msg = new Message<T>(parsedMsg, parseKind);
    if (msg.error !== null && msg.code === code.genericError) {
      const reason = new MessageError(msg.error.message);
      reason.code = msg.code;

      throw reason;
    }

    return msg;
  }
}
