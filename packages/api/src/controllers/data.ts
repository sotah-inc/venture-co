import {
  ConnectedRealmId,
  ExpansionName,
  GetAuctionsResponse,
  GetBootResponse,
  GetConnectedRealmsResponse,
  GetItemPriceHistoriesResponse,
  GetItemResponse,
  GetPostResponse,
  GetPostsResponse,
  GetPricelistResponse,
  GetProfessionPricelistResponse,
  GetProfessionPricelistsResponse,
  GetRecipePriceHistoriesResponse,
  GetRegionTokenHistoryResponse,
  GetShortTokenHistoryResponse,
  GetUnmetDemandResponse,
  IErrorResponse,
  IGetItemResponseData,
  IItemsMarketPrice,
  IQueryGeneralResponseData,
  IQueryResponseData,
  IRegionComposite,
  IRegionConnectedRealmTuple,
  IShortItem,
  IShortPet,
  ItemId,
  IValidationErrorResponse,
  Locale,
  ProfessionId,
  ProfessionsResponse,
  QueryAuctionStatsResponse,
  QueryGeneralResponse,
  QueryResponse,
  RealmSlug,
  RecipeId,
  RecipeResponse,
  RegionName,
  SkillTierId,
  SkillTierResponse,
} from "@sotah-inc/core";
import {
  Messenger,
  Post,
  ProfessionPricelist,
  ProfessionPricelistRepository,
} from "@sotah-inc/server";
import { code } from "@sotah-inc/server/build/dist/messenger/contracts";
import HTTPStatus from "http-status";
import moment from "moment";
import { ParsedQs } from "qs";
import { Connection } from "typeorm";

import {
  AuctionsQueryParamsRules,
  QueryParamRules,
  validate,
  yupValidationErrorToResponse,
} from "../lib/validator-rules";

import { IRequestResult } from "./index";

export class DataController {
  private messenger: Messenger;

  private dbConn: Connection;

  constructor(messenger: Messenger, dbConn: Connection) {
    this.messenger = messenger;
    this.dbConn = dbConn;
  }

  public async getPost(slug: string): Promise<IRequestResult<GetPostResponse>> {
    const post = await this.dbConn.getRepository(Post).findOne({ where: { slug } });
    if (typeof post === "undefined" || post === null) {
      const validationResponse: IValidationErrorResponse = {
        notFound: "Not Found",
      };

      return {
        data: validationResponse,
        status: HTTPStatus.NOT_FOUND,
      };
    }

    return {
      data: { post: post.toJson() },
      status: HTTPStatus.OK,
    };
  }

  public async getPosts(): Promise<IRequestResult<GetPostsResponse>> {
    const posts = await this.dbConn.getRepository(Post).find({ order: { id: "DESC" }, take: 3 });

    return {
      data: { posts: posts.map(v => v.toJson()) },
      status: HTTPStatus.OK,
    };
  }

  public async getBoot(): Promise<IRequestResult<GetBootResponse>> {
    const bootMessage = await this.messenger.getBoot();
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
          this.messenger
            .getConnectedRealms({ region_name: configRegion.name })
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

    const professionsMessage = await this.messenger.getProfessions(Locale.EnUS);
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

  public async getConnectedRealms(
    regionName: RegionName,
    ifModifiedSince?: string,
  ): Promise<IRequestResult<GetConnectedRealmsResponse>> {
    const realmsMessage = await this.messenger.getConnectedRealms({
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

  public async getItem(itemId: ItemId, locale: string): Promise<IRequestResult<GetItemResponse>> {
    if (!Object.values(Locale).includes(locale as Locale)) {
      const validationErrors: IValidationErrorResponse = {
        error: "could not validate locale",
      };

      return {
        data: validationErrors,
        status: HTTPStatus.BAD_REQUEST,
      };
    }

    const msg = await this.messenger.getItems({ itemIds: [itemId], locale: locale as Locale });
    if (msg.code !== code.ok) {
      const errorResponse: IErrorResponse = { error: "failed to fetch items" };

      return {
        data: errorResponse,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const itemsResult = await msg.decode();
    if (itemsResult === null) {
      const errorResponse: IErrorResponse = { error: "failed to fetch items" };

      return {
        data: errorResponse,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const foundItem = itemsResult.items.find(v => v.id === itemId);
    if (typeof foundItem === "undefined") {
      const errorResponse: IErrorResponse = { error: "item not found" };

      return {
        data: errorResponse,
        status: HTTPStatus.NOT_FOUND,
      };
    }

    const itemResponse: IGetItemResponseData = { item: foundItem };

    return { data: itemResponse, status: HTTPStatus.OK };
  }

  // eslint-disable-next-line complexity
  public async getAuctions(
    regionName: RegionName,
    realmSlug: RealmSlug,
    query: ParsedQs,
    ifModifiedSince?: string,
  ): Promise<IRequestResult<GetAuctionsResponse>> {
    // resolving connected-realm
    const resolveMessage = await this.messenger.resolveConnectedRealm({
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

    // gathering last-modified
    const realmModificationDatesMessage = await this.messenger.queryRealmModificationDates({
      connected_realm_id: resolveResult.connected_realm.connected_realm.id,
      region_name: regionName,
    });
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
    const validateParamsResult = await validate(AuctionsQueryParamsRules, query);
    if (validateParamsResult.error || !validateParamsResult.data) {
      return {
        data: yupValidationErrorToResponse(validateParamsResult.error),
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
    } = validateParamsResult.data;

    // gathering auctions
    const resolveAuctionsResponse = await this.messenger.resolveAuctions(
      {
        count,
        item_filters: itemFilters ?? [],
        page,
        pet_filters: petFilters ?? [],
        sort_direction: sortDirection,
        sort_kind: sortKind,
        tuple: {
          connected_realm_id: resolveResult.connected_realm.connected_realm.id,
          region_name: regionName,
        },
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

    const professionPricelists = await (async () => {
      if (!resolveAuctionsResponse.data || resolveAuctionsResponse.data.items.items.length === 0) {
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
    const pricelistItemsMsg = await this.messenger.getItems({ itemIds: pricelistItemIds, locale });
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

    const itemsMarketPriceMessage = await this.messenger.itemsMarketPrice({
      item_ids: resolveAuctionsResponse.data.items.items.map(v => v.id),
      tuple: {
        connected_realm_id: resolveResult.connected_realm.connected_realm.id,
        region_name: regionName,
      },
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
      const foundPrice = itemsMarketPriceResult.items_market_price[Number(itemIdString)];
      if (foundPrice === undefined) {
        return result;
      }

      return [
        ...result,
        {
          id: Number(itemIdString),
          market_price: foundPrice,
        },
      ];
    }, []);

    // eslint-disable-next-line no-console
    console.log("serving un-cached request");

    return {
      data: {
        ...resolveAuctionsResponse.data.auctions,
        items: [...resolveAuctionsResponse.data.items.items, ...pricelistItemsResult.items],
        items_market_price: itemsMarketPrice,
        pets: [...resolveAuctionsResponse.data.pets.pets],
        professionPricelists: professionPricelists.map(v => v.toJson()),
      },
      headers: {
        "Cache-Control": ["public", `max-age=${60 * 30}`],
        "Last-Modified": lastModified,
      },
      status: HTTPStatus.OK,
    };
  }

  public async queryItems(query: ParsedQs): Promise<IRequestResult<QueryResponse<IShortItem>>> {
    // parsing request params
    const validateParamsResult = await validate(QueryParamRules, query);
    if (validateParamsResult.error || !validateParamsResult.data) {
      return {
        data: yupValidationErrorToResponse(validateParamsResult.error),
        status: HTTPStatus.BAD_REQUEST,
      };
    }

    // resolving items-query message
    const results = await this.messenger.resolveQueryItems({
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
    const data: IQueryResponseData<IShortItem> = {
      items: results,
    };

    return {
      data,
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
    const results = await this.messenger.resolveQueryPets({
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
    const results = await this.messenger.queryGeneral({
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

  public async getPricelist(
    regionName: RegionName,
    realmSlug: RealmSlug,
    itemIds: ItemId[],
    locale: string,
  ): Promise<IRequestResult<GetPricelistResponse>> {
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
    const resolveMessage = await this.messenger.resolveConnectedRealm({
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

    const pricelistMessage = await this.messenger.getPriceList({
      item_ids: itemIds,
      tuple: {
        connected_realm_id: resolveResult.connected_realm.connected_realm.id,
        region_name: regionName,
      },
    });
    if (pricelistMessage.code !== code.ok) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }
    const pricelistResult = await pricelistMessage.decode();
    if (pricelistResult === null) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const itemsMessage = await this.messenger.getItems({ itemIds, locale: locale as Locale });
    if (itemsMessage.code !== code.ok) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }
    const itemsResult = await itemsMessage.decode();
    if (itemsResult === null) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const items = itemsResult.items;

    return {
      data: { price_list: pricelistResult.price_list, items },
      status: HTTPStatus.OK,
    };
  }

  public async getItemPriceHistories(
    regionName: RegionName,
    realmSlug: RealmSlug,
    itemIds: ItemId[],
    locale: string,
  ): Promise<IRequestResult<GetItemPriceHistoriesResponse>> {
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
    const resolveMessage = await this.messenger.resolveConnectedRealm({
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

    const currentUnixTimestamp = Math.floor(Date.now() / 1000);
    const lowerBounds = currentUnixTimestamp - 60 * 60 * 24 * 14;
    const itemPricesHistoryMessage = await this.messenger.resolveItemPricesHistory({
      item_ids: itemIds,
      lower_bounds: lowerBounds,
      tuple: {
        connected_realm_id: resolveResult.connected_realm.connected_realm.id,
        region_name: regionName,
      },
      upper_bounds: currentUnixTimestamp,
    });
    if (itemPricesHistoryMessage.code !== code.ok || itemPricesHistoryMessage.data === null) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const itemsMessage = await this.messenger.getItems({ itemIds, locale: locale as Locale });
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
    const items = itemsResult.items;

    return {
      data: {
        history: itemPricesHistoryMessage.data.history,
        items,
      },
      status: HTTPStatus.OK,
    };
  }

  public async getRecipePriceHistories(
    regionName: RegionName,
    realmSlug: RealmSlug,
    recipeId: RecipeId,
    locale: string,
  ): Promise<IRequestResult<GetRecipePriceHistoriesResponse>> {
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
    const resolveMessage = await this.messenger.resolveConnectedRealm({
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

    const recipeMessage = await this.messenger.getRecipe(recipeId, locale as Locale);
    if (recipeMessage.code !== code.ok) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const recipeResult = await recipeMessage.decode();
    if (recipeResult === null) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const currentUnixTimestamp = Math.floor(Date.now() / 1000);
    const lowerBounds = currentUnixTimestamp - 60 * 60 * 24 * 14;
    const historyMessage = await this.messenger.getRecipePricesHistory({
      lower_bounds: lowerBounds,
      recipe_ids: [recipeId],
      tuple: {
        connected_realm_id: resolveResult.connected_realm.connected_realm.id,
        region_name: regionName,
      },
      upper_bounds: currentUnixTimestamp,
    });
    if (historyMessage.code !== code.ok) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }
    const historyMessageResult = await historyMessage.decode();
    if (!historyMessageResult) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }
    const foundHistory = historyMessageResult.history;

    const itemPricesHistoryMessage = await this.messenger.resolveItemPricesHistory({
      item_ids: recipeResult.recipe.reagents.map(v => v.reagent.id),
      lower_bounds: lowerBounds,
      tuple: {
        connected_realm_id: resolveResult.connected_realm.connected_realm.id,
        region_name: regionName,
      },
      upper_bounds: currentUnixTimestamp,
    });
    if (itemPricesHistoryMessage.code !== code.ok) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }
    if (itemPricesHistoryMessage.data === null) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    return {
      data: {
        itemData: {
          history: itemPricesHistoryMessage.data.history,
        },
        recipeData: {
          history: foundHistory,
          recipeItemIds: {
            [recipeId]: [
              recipeResult.recipe.alliance_crafted_item.id,
              recipeResult.recipe.horde_crafted_item.id,
              recipeResult.recipe.crafted_item.id,
            ].filter(v => v !== 0),
          },
        },
      },
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
    const resolveMessage = await this.messenger.resolveConnectedRealm({
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
    const itemsMsg = await this.messenger.getItems({ itemIds, locale: locale as Locale });
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
    const pricelistMessage = await this.messenger.getPriceList({
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

    const itemsMessage = await this.messenger.getItems({ itemIds, locale: locale as Locale });
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

  public async getRegionTokenHistory(
    regionName: RegionName,
  ): Promise<IRequestResult<GetRegionTokenHistoryResponse>> {
    const msg = await this.messenger.getRegionTokenHistory({ region_name: regionName });
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

    const regionTokenHistoryResult = await msg.decode();
    if (!regionTokenHistoryResult) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    return {
      data: { history: regionTokenHistoryResult },
      status: HTTPStatus.OK,
    };
  }

  public async getTokenHistory(): Promise<IRequestResult<GetShortTokenHistoryResponse>> {
    const msg = await this.messenger.getTokenHistory();
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

    const tokenHistoryResult = await msg.decode();
    if (!tokenHistoryResult) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    return {
      data: { history: tokenHistoryResult.history },
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

    const msg = await this.messenger.queryAuctionStats(params);
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

  public async getProfessions(locale: string): Promise<IRequestResult<ProfessionsResponse>> {
    if (!Object.values(Locale).includes(locale as Locale)) {
      const validationErrors: IValidationErrorResponse = {
        error: "could not validate locale",
      };

      return {
        data: validationErrors,
        status: HTTPStatus.BAD_REQUEST,
      };
    }

    const professionsMsg = await this.messenger.getProfessions(locale as Locale);
    if (professionsMsg.code !== code.ok) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const professionsResult = await professionsMsg.decode();
    if (professionsResult === null) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    return {
      data: { professions: professionsResult.professions },
      status: HTTPStatus.OK,
    };
  }

  public async getSkillTier(
    professionId: ProfessionId,
    skillTierId: SkillTierId,
    locale: string,
  ): Promise<IRequestResult<SkillTierResponse>> {
    if (!Object.values(Locale).includes(locale as Locale)) {
      const validationErrors: IValidationErrorResponse = {
        error: "could not validate locale",
      };

      return {
        data: validationErrors,
        status: HTTPStatus.BAD_REQUEST,
      };
    }

    const skillTierMsg = await this.messenger.getSkillTier(
      professionId,
      skillTierId,
      locale as Locale,
    );
    if (skillTierMsg.code !== code.ok) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const skillTierResult = await skillTierMsg.decode();
    if (skillTierResult === null) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    return {
      data: { skillTier: skillTierResult.skilltier },
      status: HTTPStatus.OK,
    };
  }

  public async getRecipe(
    recipeId: RecipeId,
    locale: string,
  ): Promise<IRequestResult<RecipeResponse>> {
    if (!Object.values(Locale).includes(locale as Locale)) {
      const validationErrors: IValidationErrorResponse = {
        error: "could not validate locale",
      };

      return {
        data: validationErrors,
        status: HTTPStatus.BAD_REQUEST,
      };
    }

    const resolveRecipeResult = await this.messenger.resolveRecipe(recipeId, locale as Locale);
    if (resolveRecipeResult.code !== code.ok || resolveRecipeResult.data === null) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    return {
      data: {
        items: resolveRecipeResult.data.items.items,
        recipe: resolveRecipeResult.data.recipe.recipe,
      },
      status: HTTPStatus.OK,
    };
  }
}
