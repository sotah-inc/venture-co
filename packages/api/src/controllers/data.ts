import {
  ConnectedRealmId,
  ExpansionName,
  GetConnectedRealmsResponse,
  GetProfessionPricelistResponse,
  GetProfessionPricelistsResponse,
  GetUnmetDemandResponse,
  IQueryGeneralResponseData,
  IQueryResponseData,
  IRegionConnectedRealmTuple,
  IShortPet,
  ItemId,
  IValidationErrorResponse,
  Locale,
  ProfessionId,
  QueryAuctionStatsResponse,
  QueryGeneralResponse,
  QueryResponse,
  RealmSlug,
  RegionName,
} from "@sotah-inc/core";
import { IMessengers, ProfessionPricelist, ProfessionPricelistRepository } from "@sotah-inc/server";
import { code } from "@sotah-inc/server/build/dist/messenger/contracts";
import HTTPStatus from "http-status";
import moment from "moment";
import { ParsedQs } from "qs";
import { Connection } from "typeorm";

import { QueryParamRules, validate, yupValidationErrorToResponse } from "../lib/validator-rules";

import { IRequestResult } from "./index";

export class DataController {
  private messengers: IMessengers;

  private dbConn: Connection;

  constructor(messengers: IMessengers, dbConn: Connection) {
    this.messengers = messengers;
    this.dbConn = dbConn;
  }

  public async getConnectedRealms(
    regionName: RegionName,
    ifModifiedSince?: string,
  ): Promise<IRequestResult<GetConnectedRealmsResponse>> {
    const realmsMessage = await this.messengers.regions.connectedRealms({
      region_name: regionName,
    });
    switch (realmsMessage.code) {
    case code.notFound:
      return { status: HTTPStatus.NOT_FOUND, data: null };
    default:
      if (realmsMessage.code !== code.ok) {
        return { status: HTTPStatus.INTERNAL_SERVER_ERROR, data: null };
      }

      break;
    }

    const realmsResult = await realmsMessage.decode();
    if (realmsResult === null) {
      return { status: HTTPStatus.INTERNAL_SERVER_ERROR, data: null };
    }

    // gathering earliest downloaded realm-modification-date
    const lastModifiedDate: moment.Moment | null = (() => {
      const latestDownloaded = realmsResult.reduce<number | null>((result, connectedRealm) => {
        if (result === null || connectedRealm.modification_dates.downloaded > result) {
          return connectedRealm.modification_dates.downloaded;
        }

        return result;
      }, null);

      if (latestDownloaded === null) {
        return null;
      }

      return moment(latestDownloaded * 1000).utc();
    })();

    // checking if-modified-since header
    if (lastModifiedDate !== null && typeof ifModifiedSince !== "undefined") {
      const ifModifiedSinceDate = moment(new Date(ifModifiedSince)).utc();
      if (lastModifiedDate.isSameOrBefore(ifModifiedSinceDate)) {
        return {
          data: null,
          headers: {
            "Cache-Control": ["public", `max-age=${60 * 30}`],
            "Last-Modified": `${lastModifiedDate.format("ddd, DD MMM YYYY HH:mm:ss")} GMT`,
          },
          status: HTTPStatus.NOT_MODIFIED,
        };
      }
    }

    const headers = (() => {
      if (lastModifiedDate === null) {
        return;
      }

      return {
        "Cache-Control": ["public", `max-age=${60 * 30}`],
        "Last-Modified": `${lastModifiedDate.format("ddd, DD MMM YYYY HH:mm:ss")} GMT`,
      };
    })();

    return {
      data: { connectedRealms: realmsResult },
      headers,
      status: HTTPStatus.OK,
    };
  }

  public async queryPets(query: ParsedQs): Promise<IRequestResult<QueryResponse<IShortPet>>> {
    // parsing request params
    const validateParamsResult = await validate(QueryParamRules, query);
    if (validateParamsResult.error || !validateParamsResult.data) {
      return {
        data: yupValidationErrorToResponse(validateParamsResult.error),
        status: HTTPStatus.BAD_REQUEST,
      };
    }

    // resolving pets-query message
    const results = await this.messengers.pets.resolveQueryPets({
      locale: validateParamsResult.data.locale as Locale,
      query: validateParamsResult.data.query ?? "",
    });
    if (results === null) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    // formatting a response
    const data: IQueryResponseData<IShortPet> = {
      items: results,
    };

    return {
      data,
      status: HTTPStatus.OK,
    };
  }

  public async queryGeneral(query: ParsedQs): Promise<IRequestResult<QueryGeneralResponse>> {
    // parsing request params
    const validateParamsResult = await validate(QueryParamRules, query);
    if (validateParamsResult.error || !validateParamsResult.data) {
      return {
        data: yupValidationErrorToResponse(validateParamsResult.error),
        status: HTTPStatus.BAD_REQUEST,
      };
    }

    // resolving pets-query message
    const results = await this.messengers.general.queryGeneral({
      locale: validateParamsResult.data.locale as Locale,
      query: validateParamsResult.data.query ?? "",
    });
    if (results === null) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    // formatting a response
    const data: IQueryGeneralResponseData = {
      items: results,
    };

    return {
      data,
      status: HTTPStatus.OK,
    };
  }

  public async getUnmetDemand(
    regionName: RegionName,
    realmSlug: RealmSlug,
    expansionName: ExpansionName,
    locale: string,
  ): Promise<IRequestResult<GetUnmetDemandResponse>> {
    if (!Object.values(Locale).includes(locale as Locale)) {
      const validationErrors: IValidationErrorResponse = {
        error: "could not validate locale",
      };

      return {
        data: validationErrors,
        status: HTTPStatus.BAD_REQUEST,
      };
    }

    // resolving connected-realm
    const resolveMessage = await this.messengers.regions.resolveConnectedRealm({
      realm_slug: realmSlug,
      region_name: regionName,
    });
    switch (resolveMessage.code) {
    case code.ok:
      break;
    case code.notFound: {
      const notFoundValidationErrors: IValidationErrorResponse = {
        error: "could not resolve connected-realm",
      };

      return {
        data: notFoundValidationErrors,
        status: HTTPStatus.NOT_FOUND,
      };
    }
    default: {
      const defaultValidationErrors: IValidationErrorResponse = {
        error: "could not resolve connected-realm",
      };

      return {
        data: defaultValidationErrors,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }
    }

    const resolveResult = await resolveMessage.decode();
    if (resolveResult === null) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    // gathering profession-pricelists
    const professionPricelists = await this.dbConn.getRepository(ProfessionPricelist).find({
      where: { expansion: expansionName },
    });

    // gathering included item-ids
    const itemIds = professionPricelists.reduce(
      (previousValue: ItemId[], v: ProfessionPricelist) => {
        const pricelistItemIds = (v.pricelist?.entries ?? []).map(entry => entry.itemId);
        for (const itemId of pricelistItemIds) {
          if (previousValue.indexOf(itemId) === -1) {
            previousValue.push(itemId);
          }
        }

        return previousValue;
      },
      [],
    );

    // gathering items
    const itemsMsg = await this.messengers.items.items({ itemIds, locale: locale as Locale });
    if (itemsMsg.code !== code.ok) {
      return {
        data: { error: itemsMsg.error?.message },
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }
    const itemsResult = await itemsMsg.decode();
    if (!itemsResult) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    // gathering pricing data
    const pricelistMessage = await this.messengers.auctions.getPriceList({
      item_ids: itemIds,
      tuple: {
        connected_realm_id: resolveResult.connected_realm.connected_realm.id,
        region_name: regionName,
      },
    });
    if (pricelistMessage.code !== code.ok) {
      return {
        data: { error: pricelistMessage.error?.message },
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }
    const pricelistResult = await pricelistMessage.decode();
    if (!pricelistResult) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    // gathering unmet items
    const unmetItemIds = itemIds.filter(
      v =>
        !Object.keys(pricelistResult.price_list).some(
          pricelistItemId => pricelistItemId === v.toString(),
        ),
    );

    // filtering in unmet profession-pricelists
    const unmetProfessionPricelists = professionPricelists.filter(v => {
      const unmetPricelistItemIds = (v.pricelist?.entries ?? [])
        .map(entry => entry.itemId)
        .filter(itemId => unmetItemIds.indexOf(itemId) > -1);

      return unmetPricelistItemIds.length > 0;
    });

    return {
      data: {
        items: itemsResult.items,
        professionPricelists: unmetProfessionPricelists.map(v => v.toJson()),
        unmetItemIds,
      },
      status: HTTPStatus.OK,
    };
  }

  public async getProfessionPricelists(
    professionId: ProfessionId,
    expansionName: ExpansionName,
    locale: string,
  ): Promise<IRequestResult<GetProfessionPricelistsResponse>> {
    if (!Object.values(Locale).includes(locale as Locale)) {
      const validationErrors: IValidationErrorResponse = {
        error: "could not validate locale",
      };

      return {
        data: validationErrors,
        status: HTTPStatus.BAD_REQUEST,
      };
    }

    // gathering profession-pricelists
    const professionPricelists = await this.dbConn.getRepository(ProfessionPricelist).find({
      where: { professionId, expansion: expansionName },
    });

    // gathering related items
    const itemIds: ItemId[] = professionPricelists.reduce(
      (pricelistItemIds: ItemId[], professionPricelist) => {
        return (professionPricelist.pricelist?.entries ?? []).reduce(
          (entryItemIds: ItemId[], entry) => {
            if (entryItemIds.indexOf(entry.itemId) === -1) {
              entryItemIds.push(entry.itemId);
            }

            return entryItemIds;
          },
          pricelistItemIds,
        );
      },
      [],
    );

    const itemsMessage = await this.messengers.items.items({
      itemIds,
      locale: locale as Locale,
    });
    if (itemsMessage.code !== code.ok) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }
    const itemsResult = await itemsMessage.decode();
    if (!itemsResult) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    // dumping out a response
    return {
      data: {
        items: itemsResult.items,
        profession_pricelists: professionPricelists.map(v => v.toJson()),
      },
      status: HTTPStatus.OK,
    };
  }

  public async queryAuctionStats(
    regionName?: RegionName,
    connectedRealmId?: ConnectedRealmId,
  ): Promise<IRequestResult<QueryAuctionStatsResponse>> {
    const params = ((): Partial<IRegionConnectedRealmTuple> => {
      if (typeof regionName === "undefined" || regionName.length === 0) {
        return {};
      }

      if (typeof connectedRealmId === "undefined") {
        return { region_name: regionName };
      }

      return {
        connected_realm_id: Number(connectedRealmId),
        region_name: regionName,
      };
    })();

    const msg = await this.messengers.stats.queryAuctionStats(params);
    if (msg.code !== code.ok) {
      if (msg.code === code.notFound) {
        return {
          data: null,
          status: HTTPStatus.NOT_FOUND,
        };
      }

      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const auctionStatsResult = await msg.decode();
    if (!auctionStatsResult) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    return {
      data: auctionStatsResult,
      status: HTTPStatus.OK,
    };
  }

  public async getProfessionPricelist(
    professionId: ProfessionId,
    expansionName: ExpansionName,
    pricelistSlug: string,
  ): Promise<IRequestResult<GetProfessionPricelistResponse>> {
    const professionPricelist = await this.dbConn
      .getCustomRepository(ProfessionPricelistRepository)
      .getFromPricelistSlug(professionId, expansionName, pricelistSlug);
    if (professionPricelist === null) {
      return {
        data: null,
        status: HTTPStatus.NOT_FOUND,
      };
    }

    if (typeof professionPricelist.pricelist === "undefined") {
      const validationErrors: IValidationErrorResponse = {
        error: "profession-pricelist pricelist was undefined.",
      };

      return {
        data: validationErrors,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    if (typeof professionPricelist.pricelist.user === "undefined") {
      const validationErrors: IValidationErrorResponse = {
        error: "profession-pricelist pricelist user was undefined.",
      };

      return {
        data: validationErrors,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    if (typeof professionPricelist.pricelist.entries === "undefined") {
      const validationErrors: IValidationErrorResponse = {
        error: "profession-pricelist pricelist entries was undefined.",
      };

      return {
        data: validationErrors,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    return {
      data: professionPricelist.toJson(),
      status: HTTPStatus.OK,
    };
  }
}
