import {
  CreatePreferencesResponse,
  GetPreferencesResponse,
  ICreatePreferencesRequest,
  UpdatePreferencesRequest,
  UpdatePreferencesResponse,
  UserLevel,
} from "@sotah-inc/core";
import { Preference, PreferenceRepository } from "@sotah-inc/server";
import { Response } from "express";
import * as HTTPStatus from "http-status";
import { Connection } from "typeorm";

import {
  Authenticator,
  EmptyRequestBodyResponse,
  IRequest,
  IRequestResult,
  PlainRequest,
  StringMap,
} from "../index";
import { resolveUser, resolveUserId } from "../resolvers";
import { Validator } from "../validators";
import { PreferenceRules } from "../validators/yup";

export class PreferencesController {
  private dbConn: Connection;

  constructor(dbConn: Connection) {
    this.dbConn = dbConn;
  }

  @Authenticator(UserLevel.Unverified)
  public async getPreferences(
    req: PlainRequest,
    _res: Response,
  ): Promise<IRequestResult<GetPreferencesResponse>> {
    const resolveUserIdResult = resolveUserId(req.sotahUser);
    if (resolveUserIdResult.errorResponse !== null) {
      return resolveUserIdResult.errorResponse;
    }

    const preference = await this.dbConn
      .getCustomRepository(PreferenceRepository)
      .getFromUserId(resolveUserIdResult.data);
    if (preference === null) {
      return {
        data: { notFound: "Not Found" },
        status: HTTPStatus.NOT_FOUND,
      };
    }

    return {
      data: { preference: preference.toJson() },
      status: HTTPStatus.OK,
    };
  }

  @Authenticator(UserLevel.Unverified)
  @Validator(PreferenceRules)
  public async createPreferences(
    req: IRequest<ICreatePreferencesRequest, StringMap>,
    _res: Response,
  ): Promise<IRequestResult<CreatePreferencesResponse>> {
    const resolveUserResult = resolveUser(req.sotahUser);
    if (resolveUserResult.errorResponse !== null) {
      return resolveUserResult.errorResponse;
    }

    const body = req.body;
    if (body === undefined) {
      return EmptyRequestBodyResponse;
    }

    const hasPreference: boolean = await (async () => {
      const foundPreference = await this.dbConn
        .getCustomRepository(PreferenceRepository)
        .getFromUserId(resolveUserResult.data.id);
      return foundPreference !== null;
    })();
    if (hasPreference) {
      return {
        data: { error: "User already has preferences." },
        status: HTTPStatus.BAD_REQUEST,
      };
    }

    const preference = new Preference();
    preference.user = resolveUserResult.data.user;
    preference.currentRealm = body.current_realm;
    preference.currentRegion = body.current_region;
    await this.dbConn.manager.save(preference);

    return {
      data: { preference: preference.toJson() },
      status: HTTPStatus.CREATED,
    };
  }

  @Authenticator(UserLevel.Unverified)
  @Validator(PreferenceRules)
  public async updatePreferences(
    req: IRequest<UpdatePreferencesRequest, StringMap>,
    _res: Response,
  ): Promise<IRequestResult<UpdatePreferencesResponse>> {
    const resolveUserIdResult = resolveUserId(req.sotahUser);
    if (resolveUserIdResult.errorResponse !== null) {
      return resolveUserIdResult.errorResponse;
    }

    const body = req.body;
    if (body === undefined) {
      return EmptyRequestBodyResponse;
    }

    const preference = await this.dbConn
      .getCustomRepository(PreferenceRepository)
      .getFromUserId(resolveUserIdResult.data);

    if (preference === null) {
      return {
        data: { notFound: "Not Found" },
        status: HTTPStatus.NOT_FOUND,
      };
    }

    preference.currentRealm = body.current_realm;
    preference.currentRegion = body.current_region;
    await this.dbConn.manager.save(preference);

    return {
      data: { preference: preference.toJson() },
      status: HTTPStatus.OK,
    };
  }
}
