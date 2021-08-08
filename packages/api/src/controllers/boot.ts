import { GetBootResponse, IRegionComposite, Locale } from "@sotah-inc/core";
import { IMessengers } from "@sotah-inc/server";
import { code } from "@sotah-inc/server/build/dist/messenger/contracts";
import { Response } from "express";
import HTTPStatus from "http-status";

import { validate, validationErrorsToResponse } from "./validators";
import { GameVersionRules } from "./validators/yup";

import { IRequestResult, PlainRequest } from "./index";

export class BootController {
  private messengers: IMessengers;

  constructor(messengers: IMessengers) {
    this.messengers = messengers;
  }

  public async getBoot(
    req: PlainRequest,
    _res: Response,
  ): Promise<IRequestResult<GetBootResponse>> {
    const validateResult = await validate(GameVersionRules(this.messengers.regions), req.params);
    if (validateResult.errors !== null) {
      return {
        status: HTTPStatus.BAD_REQUEST,
        data: validationErrorsToResponse(validateResult.errors),
      };
    }

    const bootMessage = await this.messengers.boot.boot();
    if (bootMessage.code !== code.ok) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const bootResult = await bootMessage.decode();
    if (bootResult === null) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const regionCompositeResults = await Promise.all(
      bootResult.regions.map(configRegion => {
        return new Promise<IRegionComposite | null>((resolve, reject) => {
          this.messengers.regions
            .connectedRealms({
              region_name: configRegion.name,
              game_version: validateResult.body.game_version,
            })
            .then(v => v.decode())
            .then(v => {
              if (v === null) {
                resolve(null);

                return;
              }

              resolve({
                config_region: configRegion,
                connected_realms: v,
              });
            })
            .catch(reject);
        });
      }),
    );
    const regionComposites = regionCompositeResults.reduce<IRegionComposite[] | null>(
      (result, v) => {
        if (result === null) {
          return null;
        }

        if (v === null) {
          return null;
        }

        return [...result, v];
      },
      [],
    );
    if (regionComposites === null) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const professionsMessage = await this.messengers.professions.professions(Locale.EnUS);
    if (professionsMessage.code !== code.ok) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }
    const professionsResult = await professionsMessage.decode();
    if (professionsResult === null) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    return {
      data: {
        ...bootResult,
        regions: regionComposites,
        professions: professionsResult.professions,
      },
      status: HTTPStatus.OK,
    };
  }
}
