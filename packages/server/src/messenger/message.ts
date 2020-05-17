import { gunzip } from "../util";
import { code, IMessage } from "./index";

export enum ParseKind {
  None,
  JsonEncoded,
  GzipJsonEncoded,
}

export class Message<T> {
  public readonly error: Error | null;
  private readonly rawData: string;
  public readonly code: code;
  private readonly parseKind: ParseKind;

  constructor(msg: IMessage, parseKind: ParseKind) {
    this.error = null;
    if (msg.error.length > 0) {
      this.error = new Error(msg.error);
    }

    this.rawData = msg.data;
    this.code = msg.code;
    this.parseKind = parseKind;
  }

  public async getData(): Promise<T | string | null> {
    if (this.rawData.length === 0) {
      return null;
    }

    switch (this.parseKind) {
      case ParseKind.JsonEncoded:
        return JSON.parse(this.rawData);
      case ParseKind.GzipJsonEncoded:
        return JSON.parse((await gunzip(Buffer.from(this.rawData, "base64"))).toString());
      case ParseKind.None:
      default:
        return this.rawData;
    }
  }

  public async decode(): Promise<T | null> {
    const result = await this.getData();
    if (result === null) {
      return null;
    }

    if (typeof result === "string") {
      return null;
    }

    return result;
  }
}
