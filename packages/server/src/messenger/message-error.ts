import { code } from "./contracts";

export class MessageError {
  public message: string;
  public code: code;

  constructor() {
    this.message = "";
    this.code = code.genericError;
  }
}
