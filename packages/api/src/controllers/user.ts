import {
  CreateUserResponse,
  ICreateUserRequest,
  ISaveLastPathRequest,
  IValidationErrorResponse,
  SaveLastPathResponse,
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
import { Validator } from "./validators";
import { SaveLastPathRules, UserRequestBodyRules } from "./validators/yup";

import {
  Authenticator,
  EmptyStringMap,
  IRequest,
  IRequestResult,
  UnauthenticatedUserResponse,
} from "./index";

export class UserController {
  private readonly dbConn: Connection;

  private readonly clientHost: string;

  constructor(dbConn: Connection, clientHost: string) {
    this.dbConn = dbConn;
    this.clientHost = clientHost;
  }

  @Validator(UserRequestBodyRules)
  public async createUser(
    req: IRequest<ICreateUserRequest, EmptyStringMap, EmptyStringMap>,
    _res: Response,
  ): Promise<IRequestResult<CreateUserResponse>> {
    const registerUserResult = await createUser({
      email: req.body.email,
      password: req.body.password,
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

  @Authenticator(UserLevel.Unverified)
  public async verifyUser(
    req: IRequest<undefined, EmptyStringMap, EmptyStringMap>,
    _res: Response,
  ): Promise<IRequestResult<VerifyUserResponse>> {
    if (req.user === undefined) {
      return UnauthenticatedUserResponse;
    }

    const getUserResult = await getUser(req.user.firebaseUid);
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
      req.user.level = UserLevel.Regular;
      await this.dbConn.manager.save(req.user);

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

    const result = await generateEmailVerificationLink(this.clientHost, getUserResult.user.email);
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

  @Validator(SaveLastPathRules)
  @Authenticator(UserLevel.Unverified)
  public async saveLastPath(
    req: IRequest<ISaveLastPathRequest, EmptyStringMap, EmptyStringMap>,
    _res: Response,
  ): Promise<IRequestResult<SaveLastPathResponse>> {
    if (req.user === undefined) {
      return UnauthenticatedUserResponse;
    }

    const user = req.user;

    user.lastClientAsPath = req.body.lastClientAsPath;
    user.lastClientPathname = req.body.lastClientPathname;
    await this.dbConn.manager.save(user);

    return {
      data: null,
      status: HTTPStatus.OK,
    };
  }

  @Authenticator(UserLevel.Unverified)
  public async verifyUserConfirm(
    req: IRequest<null, Record<string, never>, Record<string, never>>,
    _res: Response,
  ): Promise<IRequestResult<null | IValidationErrorResponse>> {
    if (req.user === undefined) {
      return UnauthenticatedUserResponse;
    }

    if (req.user.level !== UserLevel.Unverified) {
      return {
        status: HTTPStatus.BAD_REQUEST,
        data: { error: "user is already verified (local)" },
      };
    }

    const getUserResult = await getUser(req.user.firebaseUid);
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

    req.user.level = UserLevel.Regular;
    await this.dbConn.manager.save(req.user);

    return {
      data: null,
      status: HTTPStatus.OK,
    };
  }
}
