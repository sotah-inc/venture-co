import {
  CreateProfessionPricelistResponse,
  DeleteProfessionPricelistResponse,
  IValidationErrorResponse,
  UserLevel,
} from "@sotah-inc/core";
import {
  Pricelist,
  PricelistEntry,
  ProfessionPricelist,
  ProfessionPricelistRepository,
  User,
} from "@sotah-inc/server";
import { Response } from "express";
import * as HTTPStatus from "http-status";
import { Connection } from "typeorm";
import * as yup from "yup";

import {
  Authenticator,
  EmptyRequestBodyResponse,
  IRequest,
  IRequestResult,
  PlainRequest,
  UnauthenticatedUserResponse,
} from "../index";
import { Validator } from "../validators";
import { ProfessionPricelistRequestBodyRules } from "../validators/yup";

export class ProfessionPricelistsCrudController {
  private dbConn: Connection;

  constructor(dbConn: Connection) {
    this.dbConn = dbConn;
  }

  @Authenticator(UserLevel.Admin)
  @Validator(ProfessionPricelistRequestBodyRules)
  public async createProfessionPricelist(
    req: IRequest<yup.InferType<typeof ProfessionPricelistRequestBodyRules>>,
    _res: Response,
  ): Promise<IRequestResult<CreateProfessionPricelistResponse>> {
    const body = req.body;
    if (body === undefined) {
      return EmptyRequestBodyResponse;
    }

    const user = req.sotahUser;
    if (user === undefined) {
      return UnauthenticatedUserResponse;
    }

    const pricelist = new Pricelist();
    pricelist.user = user;
    pricelist.name = body.pricelist.name;
    pricelist.slug = body.pricelist.slug;
    await this.dbConn.manager.save(pricelist);

    const entries = await Promise.all(
      body.entries.map(v => {
        const entry = new PricelistEntry();
        entry.pricelist = pricelist;
        entry.itemId = v.item_id;
        entry.quantityModifier = v.quantity_modifier;

        return this.dbConn.manager.save(entry);
      }),
    );

    const professionPricelist = new ProfessionPricelist();
    professionPricelist.pricelist = pricelist;
    professionPricelist.professionId = body.profession_id;
    professionPricelist.expansion = body.expansion_name;
    await this.dbConn.manager.save(professionPricelist);

    return {
      data: {
        entries: entries.map(v => v.toJson()),
        pricelist: pricelist.toJson(),
        profession_pricelist: professionPricelist.toJson(),
      },
      status: HTTPStatus.CREATED,
    };
  }

  @Authenticator(UserLevel.Admin)
  public async deleteProfessionPricelist(
    req: PlainRequest,
    _res: Response,
  ): Promise<IRequestResult<DeleteProfessionPricelistResponse>> {
    const professionPricelist = await this.dbConn
      .getCustomRepository(ProfessionPricelistRepository)
      .getFromPricelistId(Number(req.params.pricelist_id));
    if (professionPricelist === null) {
      return {
        data: null,
        status: HTTPStatus.NOT_FOUND,
      };
    }

    if (typeof professionPricelist.pricelist === "undefined") {
      const validationErrors: IValidationErrorResponse = {
        error: "Profession-pricelist pricelist was undefined.",
      };

      return {
        data: validationErrors,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    if (typeof professionPricelist.pricelist.user === "undefined") {
      const validationErrors: IValidationErrorResponse = {
        error: "Profession-pricelist pricelist user was undefined.",
      };

      return {
        data: validationErrors,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    if (professionPricelist.pricelist.user.id !== (req.user as User).id) {
      return {
        data: null,
        status: HTTPStatus.UNAUTHORIZED,
      };
    }

    if (typeof professionPricelist.pricelist.entries === "undefined") {
      const validationErrors: IValidationErrorResponse = {
        error: "Profession-pricelist pricelist entries was undefined.",
      };

      return {
        data: validationErrors,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    await Promise.all(
      professionPricelist.pricelist.entries.map(v => this.dbConn.manager.remove(v)),
    );
    await this.dbConn.manager.remove(professionPricelist);
    await this.dbConn.manager.remove(professionPricelist.pricelist);

    return {
      data: null,
      status: HTTPStatus.OK,
    };
  }
}
