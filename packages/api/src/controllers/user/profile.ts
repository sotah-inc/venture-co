import { IUpdateProfileRequest, UpdateProfileResponse, UserLevel } from "@sotah-inc/core";
import { Response } from "express";
import * as HTTPStatus from "http-status";

import { Authenticator, IRequest, IRequestResult } from "../index";

export class ProfileController {
  @Authenticator(UserLevel.Regular)
  public async updateProfile(
    _req: IRequest<IUpdateProfileRequest>,
    _res: Response,
  ): Promise<IRequestResult<UpdateProfileResponse>> {
    return {
      data: {},
      status: HTTPStatus.OK,
    };
  }
}
