import {
  CreatePricelistResponse,
  DeletePricelistResponse,
  GetPricelistsResponse,
  GetUserPricelistResponse,
  ICreatePricelistRequest,
  ItemId,
  UpdatePricelistRequest,
  UpdatePricelistResponse,
  UserLevel,
} from "@sotah-inc/core";
import { IMessengers, Pricelist, PricelistEntry, PricelistRepository } from "@sotah-inc/server";
import { code } from "@sotah-inc/server/build/dist/messenger/contracts";
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
  UnauthenticatedUserResponse,
} from "../index";
import { validate, validationErrorsToResponse, Validator } from "../validators";
import {
  createSchema,
  GameVersionRule,
  LocaleRule,
  PricelistIdRule,
  PricelistRequestBodyRules,
  SlugRule,
} from "../validators/yup";

export class PricelistCrudController {
  private dbConn: Connection;

  private messengers: IMessengers;

  constructor(dbConn: Connection, messengers: IMessengers) {
    this.dbConn = dbConn;
    this.messengers = messengers;
  }

  @Authenticator(UserLevel.Regular)
  @Validator(PricelistRequestBodyRules)
  public async createPricelist(
    req: IRequest<ICreatePricelistRequest, StringMap>,
    _res: Response,
  ): Promise<IRequestResult<CreatePricelistResponse>> {
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
    return {
      data: { entries: entries.map(v => v.toJson()), pricelist: pricelist.toJson() },
      status: HTTPStatus.CREATED,
    };
  }

  @Authenticator(UserLevel.Regular)
  public async getPricelists(
    req: PlainRequest,
    _res: Response,
  ): Promise<IRequestResult<GetPricelistsResponse>> {
    const user = req.sotahUser;
    if (user === undefined) {
      return UnauthenticatedUserResponse;
    }

    const validateQueryResult = await validate(
      createSchema({
        locale: LocaleRule,
      }),
      req.query,
    );
    if (validateQueryResult.errors !== null) {
      return {
        status: HTTPStatus.BAD_REQUEST,
        data: validationErrorsToResponse(validateQueryResult.errors),
      };
    }

    const validateParamsResult = await validate(
      createSchema({ gameVersion: GameVersionRule }),
      req.params,
    );
    if (validateParamsResult.errors !== null) {
      return {
        status: HTTPStatus.BAD_REQUEST,
        data: validationErrorsToResponse(validateParamsResult.errors),
      };
    }

    // gathering pricelists associated with this user
    let pricelists = await this.dbConn
      .getCustomRepository(PricelistRepository)
      .getAllUserPricelists(user.id ?? "-1");

    // filtering out profession-pricelists
    pricelists = pricelists.filter(
      v => typeof v.professionPricelist === "undefined" || v.professionPricelist === null,
    );

    // gathering related items
    const itemIds: ItemId[] = pricelists.reduce((pricelistsItemIds: ItemId[], pricelist) => {
      return (pricelist.entries ?? []).reduce((entriesItemIds: ItemId[], entry) => {
        if (entriesItemIds.indexOf(entry.itemId) === -1) {
          entriesItemIds.push(entry.itemId);
        }

        return entriesItemIds;
      }, pricelistsItemIds);
    }, []);
    const itemsMessage = await this.messengers.items.items({
      itemIds,
      locale: validateQueryResult.body.locale,
      game_version: validateParamsResult.body.gameVersion,
    });
    if (itemsMessage.code !== code.ok) {
      return {
        data: null,
        status: HTTPStatus.BAD_REQUEST,
      };
    }
    const itemsResult = await itemsMessage.decode();
    if (itemsResult === null) {
      return {
        data: null,
        status: HTTPStatus.BAD_REQUEST,
      };
    }

    // dumping out a response
    return {
      data: { pricelists: pricelists.map(v => v.toJson()), items: itemsResult.items },
      status: HTTPStatus.OK,
    };
  }

  public async getPricelist(
    req: PlainRequest,
    _res: Response,
  ): Promise<IRequestResult<GetUserPricelistResponse>> {
    const validateParamsResult = await validate(
      createSchema({
        id: PricelistIdRule,
      }),
      req.params,
    );
    if (validateParamsResult.errors !== null) {
      return {
        status: HTTPStatus.BAD_REQUEST,
        data: validationErrorsToResponse(validateParamsResult.errors),
      };
    }

    const user = req.sotahUser;
    if (user === undefined) {
      return UnauthenticatedUserResponse;
    }

    const userId = user.id;
    if (userId === undefined) {
      return {
        status: HTTPStatus.BAD_REQUEST,
        data: { error: "user-id was undefined" },
      };
    }

    const pricelist = await this.dbConn
      .getCustomRepository(PricelistRepository)
      .getBelongingToUserById(validateParamsResult.body.id, userId);
    if (pricelist === null) {
      return {
        data: null,
        status: HTTPStatus.NOT_FOUND,
      };
    }

    return {
      data: { pricelist: pricelist.toJson() },
      status: HTTPStatus.OK,
    };
  }

  @Authenticator(UserLevel.Regular)
  public async getPricelistFromSlug(
    req: PlainRequest,
    _res: Response,
  ): Promise<IRequestResult<GetUserPricelistResponse>> {
    const validateParamsResult = await validate(
      createSchema({
        slug: SlugRule,
      }),
      req.params,
    );
    if (validateParamsResult.errors !== null) {
      return {
        status: HTTPStatus.BAD_REQUEST,
        data: validationErrorsToResponse(validateParamsResult.errors),
      };
    }

    const user = req.sotahUser;
    if (user === undefined) {
      return UnauthenticatedUserResponse;
    }

    const userId = user.id;
    if (userId === undefined) {
      return {
        status: HTTPStatus.BAD_REQUEST,
        data: { error: "user-id was undefined" },
      };
    }
    const pricelist = await this.dbConn
      .getCustomRepository(PricelistRepository)
      .getFromPricelistSlug(userId, validateParamsResult.body.slug);
    if (pricelist === null) {
      return {
        data: null,
        status: HTTPStatus.NOT_FOUND,
      };
    }

    return {
      data: { pricelist: pricelist.toJson() },
      status: HTTPStatus.OK,
    };
  }

  @Authenticator(UserLevel.Regular)
  @Validator(PricelistRequestBodyRules)
  public async updatePricelist(
    req: IRequest<UpdatePricelistRequest, StringMap>,
    _res: Response,
  ): Promise<IRequestResult<UpdatePricelistResponse>> {
    const user = req.sotahUser;
    if (user === undefined) {
      return UnauthenticatedUserResponse;
    }

    const validateParamsResult = await validate(
      createSchema({
        id: PricelistIdRule,
      }),
      req.params,
    );
    if (validateParamsResult.errors !== null) {
      return {
        status: HTTPStatus.BAD_REQUEST,
        data: validationErrorsToResponse(validateParamsResult.errors),
      };
    }

    const body = req.body;
    if (body === undefined) {
      return EmptyRequestBodyResponse;
    }

    const userId = user.id;
    if (userId === undefined) {
      return {
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
        data: {
          error: "user did not have an id",
        },
      };
    }

    // resolving the pricelist
    const pricelist = await this.dbConn
      .getCustomRepository(PricelistRepository)
      .getBelongingToUserById(validateParamsResult.body.id, userId);
    if (pricelist === null) {
      return {
        data: null,
        status: HTTPStatus.NOT_FOUND,
      };
    }

    // saving the pricelist
    pricelist.name = body.pricelist.name;
    pricelist.slug = body.pricelist.slug;
    await this.dbConn.manager.save(pricelist);

    // misc
    const entries = pricelist.entries ?? [];

    // creating new entries
    const newRequestEntries = body.entries.filter(v => v.id === -1);
    const newEntries = await Promise.all(
      newRequestEntries.map(v => {
        const entry = new PricelistEntry();
        entry.pricelist = pricelist;
        entry.itemId = v.item_id;
        entry.quantityModifier = v.quantity_modifier;

        return this.dbConn.manager.save(entry);
      }),
    );

    // updating existing entries
    const receivedRequestEntries = body.entries.filter(v => v.id !== -1);
    let receivedEntries: PricelistEntry[] = [];
    if (receivedRequestEntries.length > 0) {
      receivedEntries = await this.dbConn
        .getRepository(PricelistEntry)
        .createQueryBuilder("entries")
        .whereInIds(receivedRequestEntries.map(v => v.id))
        .getMany();
      receivedEntries = await Promise.all(
        receivedEntries.map((v, i) => {
          v.itemId = receivedRequestEntries[i].item_id;
          v.quantityModifier = receivedRequestEntries[i].quantity_modifier;

          return this.dbConn.manager.save(v);
        }),
      );
    }

    // gathering removed entries and deleting them
    const receivedEntryIds = receivedEntries.map(v => v.id);
    const removedEntries = entries.filter(v => receivedEntryIds.indexOf(v.id) === -1);
    await Promise.all(removedEntries.map(v => this.dbConn.manager.remove(v)));

    // updating the pricelist object
    pricelist.entries = [...receivedEntries, ...newEntries];

    // dumping out a response
    return {
      data: {
        entries: pricelist.entries.map(v => v.toJson()),
        pricelist: pricelist.toJson(),
      },
      status: HTTPStatus.OK,
    };
  }

  @Authenticator(UserLevel.Regular)
  public async deletePricelist(
    req: PlainRequest,
    _res: Response,
  ): Promise<IRequestResult<DeletePricelistResponse>> {
    const validateParamsResult = await validate(
      createSchema({
        id: PricelistIdRule,
      }),
      req.params,
    );
    if (validateParamsResult.errors !== null) {
      return {
        status: HTTPStatus.BAD_REQUEST,
        data: validationErrorsToResponse(validateParamsResult.errors),
      };
    }

    const user = req.sotahUser;
    if (user === undefined) {
      return UnauthenticatedUserResponse;
    }

    const userId = user.id;
    if (userId === undefined) {
      return {
        status: HTTPStatus.BAD_REQUEST,
        data: { error: "user-id was undefined" },
      };
    }

    // resolving the pricelist
    const removed = await this.dbConn
      .getCustomRepository(PricelistRepository)
      .removeByUserId(validateParamsResult.body.id, userId);
    if (!removed) {
      return {
        data: null,
        status: HTTPStatus.NOT_FOUND,
      };
    }

    return {
      data: null,
      status: HTTPStatus.OK,
    };
  }
}
