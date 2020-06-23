import {
  CreateProfessionPricelistResponse,
  DeleteProfessionPricelistResponse,
  ICreateProfessionPricelistRequest,
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

import { ProfessionPricelistRequestBodyRules } from "../../lib/validator-rules";
import { Authenticator, IRequest, IRequestResult, Validator } from "../index";

export class ProfessionPricelistsCrudController {
  private dbConn: Connection;

  constructor(dbConn: Connection) {
    this.dbConn = dbConn;
  }

  @Authenticator<ICreateProfessionPricelistRequest, CreateProfessionPricelistResponse>(
    UserLevel.Admin,
  )
  @Validator<ICreateProfessionPricelistRequest, CreateProfessionPricelistResponse>(
    ProfessionPricelistRequestBodyRules,
  )
  public async createProfessionPricelist(
    req: IRequest<ICreateProfessionPricelistRequest>,
    _res: Response,
  ): Promise<IRequestResult<CreateProfessionPricelistResponse>> {
    const pricelist = new Pricelist();
    pricelist.user = req.user as User;
    pricelist.name = req.body.pricelist.name;
    pricelist.slug = req.body.pricelist.slug;
    await this.dbConn.manager.save(pricelist);

    const entries = await Promise.all(
      req.body.entries.map(v => {
        const entry = new PricelistEntry();
        entry.pricelist = pricelist;
        entry.itemId = v.item_id;
        entry.quantityModifier = v.quantity_modifier;

        return this.dbConn.manager.save(entry);
      }),
    );

    const professionPricelist = new ProfessionPricelist();
    professionPricelist.pricelist = pricelist;
    professionPricelist.name = req.body.profession_name;
    professionPricelist.expansion = req.body.expansion_name;
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

  @Authenticator<null, DeleteProfessionPricelistResponse>(UserLevel.Admin)
  public async deleteProfessionPricelist(
    req: IRequest<null>,
    _res: Response,
  ): Promise<IRequestResult<DeleteProfessionPricelistResponse>> {
    const professionPricelist = await this.dbConn
      .getCustomRepository(ProfessionPricelistRepository)
      .getFromPricelistId(Number(req.params["pricelist_id"]));
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
