import {
  CreateUserResponse,
  ICreateUserRequest,
  UserLevel,
} from "@sotah-inc/core";
import {  User } from "@sotah-inc/server";
import * as HTTPStatus from "http-status";
import { Connection } from "typeorm";

import { createUser } from "../coal";
import {
  UserRequestBodyRules,
  validate,
  yupValidationErrorToResponse,
} from "../lib/validator-rules";

import { IRequestResult } from "./index";

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
}
