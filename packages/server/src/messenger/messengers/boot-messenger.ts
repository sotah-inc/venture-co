import { NatsConnection } from "nats";

import { IGetBootResponse, IGetSessionSecretResponse } from "../contracts";
import { Message } from "../message";
import { BaseMessenger } from "./base";

enum subjects {
  boot = "boot",
  sessionSecret = "sessionSecret",
}

export class BootMessenger extends BaseMessenger {
  constructor(conn: NatsConnection) {
    super(conn);
  }

  public boot(): Promise<Message<IGetBootResponse>> {
    return this.request(subjects.boot);
  }

  public sessionSecret(): Promise<Message<IGetSessionSecretResponse>> {
    return this.request(subjects.sessionSecret);
  }
}
