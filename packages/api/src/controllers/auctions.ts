import { GetAuctionsResponse, IItemsMarketPrice, ItemId, RecipeId } from "@sotah-inc/core";
import { IMessengers, ProfessionPricelist } from "@sotah-inc/server";
import { code } from "@sotah-inc/server/build/dist/messenger/contracts";
import {
  ResolveRecipesResponse,
} from "@sotah-inc/server/build/dist/messenger/contracts/professions";
import { Response } from "express";
import HTTPStatus from "http-status";
import moment from "moment";
import { Connection } from "typeorm";

import { resolveRealmSlug } from "./resolvers";
import { validate, validationErrorsToResponse } from "./validators";
import { AuctionsQueryParamsRules } from "./validators/yup";

import { IRequestResult, PlainRequest } from "./index";

export class AuctionsController {
  private messengers: IMessengers;

  private dbConn: Connection;

  constructor(messengers: IMessengers, dbConn: Connection) {
    this.messengers = messengers;
    this.dbConn = dbConn;
  }

  public async getAuctions(
    req: PlainRequest,
    _res: Response,
  ): Promise<IRequestResult<GetAuctionsResponse>> {
    const resolveResult = await resolveRealmSlug(req.params, this.messengers.regions);
    if (resolveResult.errorResponse !== null) {
      return resolveResult.errorResponse;
    }

    const realmModificationDatesMessage = await this.messengers.regions.queryRealmModificationDates(
      resolveResult.data.tuple,
    );
    switch (realmModificationDatesMessage.code) {
    case code.ok:
      break;
    case code.notFound:
      return {
        data: {
          error: `${realmModificationDatesMessage.error?.message} (realm-modification-dates)`,
        },
        status: HTTPStatus.NOT_FOUND,
      };
    default:
      return {
        data: { error: realmModificationDatesMessage.error?.message },
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const realmModificationDatesResult = await realmModificationDatesMessage.decode();
    if (realmModificationDatesResult === null) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const lastModifiedDate = moment(realmModificationDatesResult.downloaded * 1000).utc();
    const lastModified = `${lastModifiedDate.format("ddd, DD MMM YYYY HH:mm:ss")} GMT`;

    // checking if-modified-since header
    const ifModifiedSince = req.headers["if-modified-since"];
    if (ifModifiedSince) {
      const ifModifiedSinceDate = moment(new Date(ifModifiedSince)).utc();
      if (lastModifiedDate.isSameOrBefore(ifModifiedSinceDate)) {
        // eslint-disable-next-line no-console
        console.log("serving cached request");

        return {
          data: null,
          headers: {
            "Cache-Control": ["public", `max-age=${60 * 30}`],
            "Last-Modified": lastModified,
          },
          status: HTTPStatus.NOT_MODIFIED,
        };
      }
    }

    // parsing request params
    const validateQueryResult = await validate(AuctionsQueryParamsRules, req.query);
    if (validateQueryResult.errors !== null) {
      return {
        data: validationErrorsToResponse(validateQueryResult.errors),
        status: HTTPStatus.BAD_REQUEST,
      };
    }

    const {
      count,
      page,
      sortDirection,
      sortKind,
      itemFilters,
      locale,
      petFilters,
    } = validateQueryResult.body;

    // gathering auctions
    const resolveAuctionsResponse = await this.messengers.liveAuctions.resolveAuctions(
      {
        count,
        item_filters: itemFilters ?? [],
        page,
        pet_filters: petFilters ?? [],
        sort_direction: sortDirection,
        sort_kind: sortKind,
        tuple: resolveResult.data.tuple,
      },
      locale,
    );
    switch (resolveAuctionsResponse.code) {
    case code.ok:
      break;
    case code.notFound:
      return {
        data: { error: `${resolveAuctionsResponse.error ?? ""} (auctions)` },
        status: HTTPStatus.NOT_FOUND,
      };
    case code.userError:
      return {
        data: { error: resolveAuctionsResponse.error ?? "" },
        status: HTTPStatus.BAD_REQUEST,
      };
    default:
      return {
        data: { error: resolveAuctionsResponse.error ?? "" },
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    if (resolveAuctionsResponse.data === null) {
      return {
        data: { error: resolveAuctionsResponse.error ?? "" },
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const itemIds = resolveAuctionsResponse.data.items.items.map(v => v.id);

    const professionPricelists = await (async () => {
      if (!resolveAuctionsResponse.data || itemIds.length === 0) {
        return [];
      }

      const itemIdsClause = resolveAuctionsResponse.data.items.items.map(v => v.id).join(", ");

      return this.dbConn
        .getRepository(ProfessionPricelist)
        .createQueryBuilder("professionpricelist")
        .leftJoinAndSelect("professionpricelist.pricelist", "pricelist")
        .leftJoinAndSelect("pricelist.entries", "entry")
        .where(`entry.itemId IN (${itemIdsClause})`)
        .getMany();
    })();

    const pricelistItemIds: ItemId[] = [
      ...professionPricelists.map(v => (v.pricelist?.entries ?? []).map(y => y.itemId)[0]),
    ];
    const pricelistItemsMsg = await this.messengers.items.items({
      itemIds: pricelistItemIds,
      locale,
      game_version: resolveResult.data.gameVersion,
    });
    if (pricelistItemsMsg.code !== code.ok) {
      return {
        data: { error: pricelistItemsMsg.error?.message ?? "" },
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const pricelistItemsResult = await pricelistItemsMsg.decode();
    if (pricelistItemsResult === null) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const itemsMarketPriceMessage = await this.messengers.pricelistHistory.itemsMarketPrice({
      item_ids: resolveAuctionsResponse.data.items.items.map(v => v.id),
      tuple: resolveResult.data.tuple,
    });
    if (itemsMarketPriceMessage.code !== code.ok) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const itemsMarketPriceResult = await itemsMarketPriceMessage.decode();
    if (itemsMarketPriceResult === null) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const itemsMarketPrice = Object.keys(itemsMarketPriceResult.items_market_price).reduce<
      IItemsMarketPrice[]
    >((result, itemIdString) => {
      const itemId = Number(itemIdString);

      const foundPrice = itemsMarketPriceResult.items_market_price[itemId];
      if (foundPrice === undefined) {
        return result;
      }

      return [
        ...result,
        {
          id: itemId,
          market_price: foundPrice,
        },
      ];
    }, []);

    // resolving items-recipe-ids
    const itemRecipeIdsResult = await this.messengers.professions.resolveAllItemRecipes(itemIds);
    if (itemRecipeIdsResult.code !== code.ok || itemRecipeIdsResult.data === null) {
      return {
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }

    // resolving recipes
    const recipeIds = ((): RecipeId[] => {
      const recipeIdSet = new Set<RecipeId>();
      for (const resolveItem of itemRecipeIdsResult.data.itemRecipes) {
        for (const itemIdString of Object.keys(resolveItem.response)) {
          const foundRecipeIds = resolveItem.response[Number(itemIdString)];
          if (foundRecipeIds === null || foundRecipeIds === undefined) {
            continue;
          }

          for (const recipeId of foundRecipeIds) {
            recipeIdSet.add(recipeId);
          }
        }
      }

      return Array.from(recipeIdSet);
    })();

    let resolveRecipesResult: ResolveRecipesResponse | null = null;
    if (recipeIds.length > 0) {
      resolveRecipesResult = await this.messengers.professions.resolveRecipes(recipeIds, locale);
      if (resolveRecipesResult.code !== code.ok || resolveRecipesResult.data === null) {
        return {
          status: HTTPStatus.INTERNAL_SERVER_ERROR,
          data: null,
        };
      }
    }

    // eslint-disable-next-line no-console
    console.log("serving un-cached request");

    return {
      data: {
        ...resolveAuctionsResponse.data.auctions,
        items: [...resolveAuctionsResponse.data.items.items, ...pricelistItemsResult.items],
        items_market_price: itemsMarketPrice,
        pets: [...resolveAuctionsResponse.data.pets.pets],
        professionPricelists: professionPricelists.map(v => v.toJson()),
        itemsRecipes: {
          itemsRecipes: itemRecipeIdsResult.data.itemRecipes.map(v => {
            return {
              kind: v.kind,
              ids: v.response,
            };
          }),
          professions: [],
          recipes: [],
          skillTiers: [],
          ...resolveRecipesResult?.data,
        },
      },
      headers: {
        "Cache-Control": ["public", `max-age=${60 * 30}`],
        "Last-Modified": lastModified,
      },
      status: HTTPStatus.OK,
    };
  }
}
