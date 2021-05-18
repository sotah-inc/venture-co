import {
  CreateUserResponse,
  ICreateUserRequest,
  IValidationErrorResponse,
  UserLevel,
  VerifyUserResponse,
} from "@sotah-inc/core";
import { User } from "@sotah-inc/server";
import { Response } from "express";
import * as HTTPStatus from "http-status";
import { Connection } from "typeorm";

import { createUser } from "../coal";
import { generateEmailVerificationLink } from "../coal/generate-email-verification-link";
import { getUser } from "../coal/get-user";
import {
  UserRequestBodyRules,
  validate,
  yupValidationErrorToResponse,
} from "../lib/validator-rules";

import { Authenticator, IRequest, IRequestResult } from "./index";

export class UserController {
  private readonly dbConn: Connection;

  constructor(dbConn: Connection) {
    this.dbConn = dbConn;
  }

  public async createUser(body: ICreateUserRequest): Promise<IRequestResult<CreateUserResponse>> {
    const result = await validate(UserRequestBodyRules, body);
    if (result.error || !result.data) {
      return {
        data: yupValidationErrorToResponse(result.error),
        status: HTTPStatus.BAD_REQUEST,
      };
    }

    const registerUserResult = await createUser({
      email: result.data.email,
      password: result.data.password,
    });
    if (registerUserResult.errors !== null) {
      return {
        data: registerUserResult.errors,
        status: HTTPStatus.BAD_REQUEST,
      };
    }
    if (registerUserResult.userData === null) {
      return {
        data: {},
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const user = new User();
    user.firebaseUid = registerUserResult.userData.firebaseUid;
    user.level = UserLevel.Unverified;
    await this.dbConn.manager.save(user);

    return {
      data: {
        token: registerUserResult.userData.token,
        user: user.toJson(),
      },
      status: HTTPStatus.CREATED,
    };
  }

  @Authenticator<null, VerifyUserResponse>(UserLevel.Unverified)
  public async verifyUser(
    req: IRequest<null>,
    _res: Response,
  ): Promise<IRequestResult<VerifyUserResponse>> {
    const user = req.user as User;
    const getUserResult = await getUser(user.firebaseUid);
    if (getUserResult.errors !== null) {
      return {
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
        data: getUserResult.errors,
      };
    }
    if (getUserResult.user === null) {
      return {
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
        data: { error: "user in result was null" },
      };
    }
    if (getUserResult.user.emailVerified) {
      user.level = UserLevel.Regular;
      await this.dbConn.manager.save(user);

      return {
        status: HTTPStatus.NO_CONTENT,
        data: null,
      };
    }
    if (getUserResult.user.email === undefined) {
      return {
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
        data: { error: "email in user was undefined" },
      };
    }

    const result = await generateEmailVerificationLink(getUserResult.user.email);
    if (result.errors !== null) {
      return {
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
        data: result.errors,
      };
    }
    if (result.destination === null) {
      return {
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
        data: { error: "email verification link was null" },
      };
    }

    return {
      data: {
        destination: result.destination,
      },
      status: HTTPStatus.OK,
    };
  }

  @Authenticator<null, null>(UserLevel.Unverified)
  public async verifyUserConfirm(
    req: IRequest<null>,
    _res: Response,
  ): Promise<IRequestResult<null | IValidationErrorResponse>> {
    const user = req.user as User;

    if (user.level !== UserLevel.Unverified) {
      return {
        status: HTTPStatus.BAD_REQUEST,
        data: { error: "user is already verified (local)" },
      };
    }

    const getUserResult = await getUser(user.firebaseUid);
    if (getUserResult.errors !== null) {
      return {
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
        data: getUserResult.errors,
      };
    }
    if (getUserResult.user === null) {
      return {
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
        data: { error: "user in result was null" },
      };
    }
    if (!getUserResult.user.emailVerified) {
      return {
        status: HTTPStatus.BAD_REQUEST,
        data: { error: "user is not verified (firebase)" },
      };
    }

    user.level = UserLevel.Regular;
    await this.dbConn.manager.save(user);

    return {
      data: null,
      status: HTTPStatus.OK,
    };
  }
}
