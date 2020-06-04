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

import { UpdateProfileRequestBodyRules, validate } from "../../lib/validator-rules";
import { Authenticator, IRequest, IRequestResult } from "../index";

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

    const result = await validate(
      UpdateProfileRequestBodyRules(this.dbConn.getCustomRepository(UserRepository), user.email),
      req,
    );
    if (result.error || !result.data) {
      const validationErrors: IValidationErrorResponse = result.error
        ? { [result.error.path]: result.error.message }
        : {};

      return { data: validationErrors, status: HTTPStatus.BAD_REQUEST };
    }

    user.email = result.data.email;

    await this.dbConn.manager.save(user);

    return {
      data: { email: user.email },
      status: HTTPStatus.OK,
    };
  }
}
