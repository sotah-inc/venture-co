import { GetBootResponse } from "@sotah-inc/core";
import { IMessengers } from "@sotah-inc/server";
import { code } from "@sotah-inc/server/build/dist/messenger/contracts";
import { Response } from "express";
import HTTPStatus from "http-status";

import { IRequestResult, PlainRequest } from "./index";

export class BootController {
  private messengers: IMessengers;

  constructor(messengers: IMessengers) {
    this.messengers = messengers;
  }

  public async getBoot(
    _req: PlainRequest,
    _res: Response,
  ): Promise<IRequestResult<GetBootResponse>> {
    const bootMessage = await this.messengers.boot.boot();
    if (bootMessage.code !== code.ok) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const bootResult = await bootMessage.decode();
    if (bootResult === null) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    return {
      data: bootResult,
      status: HTTPStatus.OK,
    };
  }
}
