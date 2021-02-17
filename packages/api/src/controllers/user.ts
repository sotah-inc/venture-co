import {
  CreateUserResponse,
  ICreateUserRequest,
  ILoginRequest,
  IValidationErrorResponse,
  LoginResponse,
  UserLevel,
} from "@sotah-inc/core";
import { Messenger, User } from "@sotah-inc/server";
import * as bcrypt from "bcrypt";
import * as HTTPStatus from "http-status";
import { Connection } from "typeorm";

import {
  UserRequestBodyRules,
  validate,
  yupValidationErrorToResponse,
} from "../lib/validator-rules";
import { IRequestResult } from "./index";

export class UserController {
  private readonly messenger: Messenger;

  private readonly dbConn: Connection;

  constructor(messenger: Messenger, dbConn: Connection) {
    this.messenger = messenger;
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

    const existingUser = await this.dbConn
      .getRepository(User)
      .findOne({ where: { email: result.data.email } });
    if (typeof existingUser !== "undefined") {
      const userValidationError: IValidationErrorResponse = { email: "email is already in use" };

      return {
        data: userValidationError,
        status: HTTPStatus.BAD_REQUEST,
      };
    }

    const user = new User();
    user.email = result.data.email;
    user.hashedPassword = await bcrypt.hash(result.data.password, 10);
    user.level = UserLevel.Unverified;
    await this.dbConn.manager.save(user);

    return {
      data: {
        token: await user.generateJwtToken(this.messenger),
        user: user.toJson(),
      },
      status: HTTPStatus.CREATED,
    };
  }

  public async login(body: ILoginRequest): Promise<IRequestResult<LoginResponse>> {
    // validating provided email
    const email: string = body.email;
    const user = await this.dbConn.getRepository(User).findOne({ where: { email } });
    if (typeof user === "undefined") {
      const userValidationError = { email: "invalid email" };

      return {
        data: userValidationError,
        status: HTTPStatus.BAD_REQUEST,
      };
    }

    // validating provided password
    const password: string = body.password;
    const isMatching = await bcrypt.compare(password, user.hashedPassword);
    if (!isMatching) {
      const passwordValidationError = { password: "invalid password" };

      return {
        data: passwordValidationError,
        status: HTTPStatus.BAD_REQUEST,
      };
    }

    // issuing a jwt token
    return {
      data: {
        token: await user.generateJwtToken(this.messenger),
        user: user.toJson(),
      },
      status: HTTPStatus.OK,
    };
  }
}
