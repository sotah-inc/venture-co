import {
  IUpdateProfileRequest,
  IUpdateProfileResponse,
  IValidationErrorResponse,
  UserLevel,
} from "@sotah-inc/core";
import { User, UserRepository } from "@sotah-inc/server";
import { Response } from "express";
import * as HTTPStatus from "http-status";
import { Connection } from "typeorm";

import { UpdateProfileRequestBodyRules } from "../../lib/validator-rules";
import { Authenticator, IRequest, IRequestResult, ManualValidator } from "../index";

export class ProfileController {
  private dbConn: Connection;

  constructor(dbConn: Connection) {
    this.dbConn = dbConn;
  }

  @Authenticator<IUpdateProfileRequest, IUpdateProfileResponse>(UserLevel.Regular)
  public async updateProfile(
    req: IRequest<IUpdateProfileRequest>,
    _res: Response,
  ): Promise<IRequestResult<IUpdateProfileResponse | IValidationErrorResponse>> {
    const user = req.user as User;

    const result = await ManualValidator<IUpdateProfileRequest>(
      req,
      UpdateProfileRequestBodyRules(this.dbConn.getCustomRepository(UserRepository), user.email),
    );
    if (typeof result.errorResult !== "undefined") {
      return result.errorResult;
    }
    const { body } = result.req!;

    user.email = body.email;

    await this.dbConn.manager.save(user);

    return {
      data: { email: user.email },
      status: HTTPStatus.OK,
    };
  }
}
