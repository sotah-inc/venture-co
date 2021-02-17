import {
  CreatePreferencesResponse,
  GetPreferencesResponse,
  ICreatePreferencesRequest,
  UpdatePreferencesRequest,
  UpdatePreferencesResponse,
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

  @Authenticator<null, GetPreferencesResponse>(UserLevel.Unverified)
  public async getPreferences(
    req: IRequest<null>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _res: Response,
  ): Promise<IRequestResult<GetPreferencesResponse>> {
    const user = req.user as User;
    const preference = await this.dbConn
      .getCustomRepository(PreferenceRepository)
      .getFromUserId(user.id ?? -1);

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

  @Authenticator<ICreatePreferencesRequest, CreatePreferencesResponse>(UserLevel.Unverified)
  @Validator<ICreatePreferencesRequest, CreatePreferencesResponse>(PreferenceRules)
  public async createPreferences(
    req: IRequest<ICreatePreferencesRequest>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _res: Response,
  ): Promise<IRequestResult<CreatePreferencesResponse>> {
    const user = req.user as User;
    const hasPreference: boolean = await (async () => {
      const foundPreference = await this.dbConn
        .getCustomRepository(PreferenceRepository)
        .getFromUserId(user.id ?? -1);
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

  @Authenticator<UpdatePreferencesRequest, UpdatePreferencesResponse>(UserLevel.Unverified)
  @Validator<UpdatePreferencesRequest, UpdatePreferencesResponse>(PreferenceRules)
  public async updatePreferences(
    req: IRequest<UpdatePreferencesRequest>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _res: Response,
  ): Promise<IRequestResult<UpdatePreferencesResponse>> {
    const user = req.user as User;
    const preference = await this.dbConn
      .getCustomRepository(PreferenceRepository)
      .getFromUserId(user.id ?? -1);

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
