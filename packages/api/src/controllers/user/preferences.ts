import {
  ICreatePreferencesRequest,
  ICreatePreferencesResponse,
  IGetPreferencesResponse,
  IUpdatePreferencesRequest,
  IUpdatePreferencesResponse,
  IValidationErrorResponse,
  UserLevel,
} from "@sotah-inc/core";
import { Preference, PreferenceRepository, User } from "@sotah-inc/server";
import { Response } from "express";
import * as HTTPStatus from "http-status";
import { Connection } from "typeorm";

import { PreferenceRules } from "../../lib/validator-rules";
import { Authenticator, IRequest, IRequestResult, Validator } from "../index";

export class PreferencesController {
  private dbConn: Connection;

  constructor(dbConn: Connection) {
    this.dbConn = dbConn;
  }

  @Authenticator<null, IGetPreferencesResponse | IValidationErrorResponse>(UserLevel.Unverified)
  public async getPreferences(
    req: IRequest<null>,
    _res: Response,
  ): Promise<IRequestResult<IGetPreferencesResponse | IValidationErrorResponse>> {
    const user = req.user as User;
    const preference = await this.dbConn
      .getCustomRepository(PreferenceRepository)
      .getFromUserId(user.id!);

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

  @Authenticator<ICreatePreferencesRequest, ICreatePreferencesResponse | IValidationErrorResponse>(
    UserLevel.Unverified,
  )
  @Validator<ICreatePreferencesRequest, ICreatePreferencesResponse>(PreferenceRules)
  public async createPreferences(
    req: IRequest<ICreatePreferencesRequest>,
    _res: Response,
  ): Promise<IRequestResult<ICreatePreferencesResponse | IValidationErrorResponse>> {
    const user = req.user as User;
    const hasPreference: boolean = await (async () => {
      const foundPreference = await this.dbConn
        .getCustomRepository(PreferenceRepository)
        .getFromUserId(user.id!);
      return foundPreference !== null;
    })();
    if (hasPreference) {
      return {
        data: { error: "User already has preferences." },
        status: HTTPStatus.BAD_REQUEST,
      };
    }

    const preference = new Preference();
    preference.user = user;
    preference.currentRealm = req.body.current_realm;
    preference.currentRegion = req.body.current_region;
    await this.dbConn.manager.save(preference);

    return {
      data: { preference: preference.toJson() },
      status: HTTPStatus.CREATED,
    };
  }

  @Authenticator<IUpdatePreferencesRequest, IUpdatePreferencesResponse | IValidationErrorResponse>(
    UserLevel.Unverified,
  )
  @Validator<IUpdatePreferencesRequest, IUpdatePreferencesResponse>(PreferenceRules)
  public async updatePreferences(
    req: IRequest<IUpdatePreferencesRequest>,
    _res: Response,
  ): Promise<IRequestResult<IUpdatePreferencesResponse | IValidationErrorResponse>> {
    const user = req.user as User;
    const preference = await this.dbConn
      .getCustomRepository(PreferenceRepository)
      .getFromUserId(user.id!);

    if (preference === null) {
      return {
        data: { notFound: "Not Found" },
        status: HTTPStatus.NOT_FOUND,
      };
    }

    preference.currentRealm = req.body.current_realm;
    preference.currentRegion = req.body.current_region;
    await this.dbConn.manager.save(preference);

    return {
      data: { preference: preference.toJson() },
      status: HTTPStatus.OK,
    };
  }
}
