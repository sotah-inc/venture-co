import { code } from "./contracts";

export class MessageError extends Error {
  public code: code;

  constructor(message: string) {
    super(message);

    this.code = code.genericError;
  }
}
