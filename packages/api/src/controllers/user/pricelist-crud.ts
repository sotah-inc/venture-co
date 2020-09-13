import {
  CreatePricelistResponse,
  DeletePricelistResponse,
  GetPricelistsResponse,
  GetUserPricelistResponse,
  ICreatePricelistRequest,
  ItemId,
  IValidationErrorResponse,
  ProfessionName,
  UpdatePricelistRequest,
  UpdatePricelistResponse,
} from "@sotah-inc/core";
import { Messenger, Pricelist, PricelistEntry, PricelistRepository, User } from "@sotah-inc/server";
import * as HTTPStatus from "http-status";
import { Connection } from "typeorm";

import {
  PricelistRequestBodyRules,
  validate,
  yupValidationErrorToResponse,
} from "../../lib/validator-rules";
import { IRequestResult } from "../index";

export class PricelistCrudController {
  private dbConn: Connection;
  private messenger: Messenger;

  constructor(dbConn: Connection, messenger: Messenger) {
    this.dbConn = dbConn;
    this.messenger = messenger;
  }

  public async createPricelist(
    user: User,
    body: ICreatePricelistRequest,
  ): Promise<IRequestResult<CreatePricelistResponse>> {
    const result = await validate(PricelistRequestBodyRules, body);
    if (result.error || !result.data) {
      const validationErrors: IValidationErrorResponse = result.error
        ? { [result.error.path]: result.error.message }
        : {};

      return {
        data: validationErrors,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const pricelist = new Pricelist();
    pricelist.user = user;
    pricelist.name = result.data.pricelist.name;
    pricelist.slug = result.data.pricelist.slug;
    await this.dbConn.manager.save(pricelist);
    const entries = await Promise.all(
      result.data.entries.map(v => {
        const entry = new PricelistEntry();
        entry.pricelist = pricelist;
        entry.itemId = v!.item_id;
        entry.quantityModifier = v!.quantity_modifier;

        return this.dbConn.manager.save(entry);
      }),
    );
    return {
      data: { entries: entries.map(v => v.toJson()), pricelist: pricelist.toJson() },
      status: HTTPStatus.CREATED,
    };
  }

  public async getPricelists(user: User): Promise<IRequestResult<GetPricelistsResponse>> {
    // gathering pricelists associated with this user
    let pricelists = await this.dbConn
      .getCustomRepository(PricelistRepository)
      .getAllUserPricelists(user.id!);

    // filtering out profession-pricelists
    pricelists = pricelists.filter(
      v => typeof v.professionPricelist === "undefined" || v.professionPricelist === null,
    );

    // gathering related items
    const itemIds: ItemId[] = pricelists.reduce((pricelistsItemIds: ItemId[], pricelist) => {
      return pricelist.entries!.reduce((entriesItemIds: ItemId[], entry) => {
        if (entriesItemIds.indexOf(entry.itemId) === -1) {
          entriesItemIds.push(entry.itemId);
        }

        return entriesItemIds;
      }, pricelistsItemIds);
    }, []);
    const items = (await (await this.messenger.getItems({ itemIds, locale })).decode())!.items;

    // dumping out a response
    return {
      data: { pricelists: pricelists.map(v => v.toJson()), items },
      status: HTTPStatus.OK,
    };
  }

  public async getPricelist(
    id: number,
    user: User,
  ): Promise<IRequestResult<GetUserPricelistResponse>> {
    const pricelist = await this.dbConn
      .getCustomRepository(PricelistRepository)
      .getBelongingToUserById(id, user.id!);
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

  public async getPricelistFromSlug(
    user: User,
    professionName: ProfessionName,
  ): Promise<IRequestResult<GetUserPricelistResponse>> {
    const pricelist = await this.dbConn
      .getCustomRepository(PricelistRepository)
      .getFromPricelistSlug(user.id!, professionName);
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

  public async updatePricelist(
    id: number,
    user: User,
    body: UpdatePricelistRequest,
  ): Promise<IRequestResult<UpdatePricelistResponse>> {
    // resolving the pricelist
    const pricelist = await this.dbConn
      .getCustomRepository(PricelistRepository)
      .getBelongingToUserById(id, user.id!);
    if (pricelist === null) {
      return {
        data: null,
        status: HTTPStatus.NOT_FOUND,
      };
    }

    // validating the request body
    const result = await validate(PricelistRequestBodyRules, body);
    if (result.error || !result.data) {
      return {
        data: yupValidationErrorToResponse(result.error),
        status: HTTPStatus.BAD_REQUEST,
      };
    }

    // saving the pricelist
    pricelist.name = result.data.pricelist.name;
    pricelist.slug = result.data.pricelist.slug;
    await this.dbConn.manager.save(pricelist);

    // misc
    const entries = pricelist.entries!;

    // creating new entries
    const newRequestEntries = result.data.entries.filter(v => v.id === -1);
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
    const receivedRequestEntries = result.data.entries.filter(v => v.id !== -1);
    let receivedEntries = await this.dbConn
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

  public async deletePricelist(
    id: number,
    user: User,
  ): Promise<IRequestResult<DeletePricelistResponse>> {
    // resolving the pricelist
    const removed = await this.dbConn
      .getCustomRepository(PricelistRepository)
      .removeByUserId(id, user.id!);
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
