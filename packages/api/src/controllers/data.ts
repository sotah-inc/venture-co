import {
  ConnectedRealmId,
  ExpansionName,
  GetAuctionsResponse,
  GetBootResponse,
  GetConnectedRealmsResponse,
  GetItemResponse,
  GetPostResponse,
  GetPostsResponse,
  GetPricelistHistoriesResponse,
  GetPricelistResponse,
  GetProfessionPricelistResponse,
  GetProfessionPricelistsResponse,
  GetTokenHistoryResponse,
  GetUnmetDemandResponse,
  IBollingerBands,
  IErrorResponse,
  IGetItemResponseData,
  IItemPriceLimits,
  IItemPricelistHistoryMap,
  IPriceLimits,
  IPricelistHistoryMap,
  IPrices,
  IPricesFlagged,
  IQueryItemsResponseData,
  IRegionComposite,
  IRegionConnectedRealmTuple,
  ItemId,
  IValidationErrorResponse,
  Locale,
  ProfessionName,
  QueryAuctionStatsResponse,
  QueryItemsResponse,
  RealmSlug,
  RegionName,
} from "@sotah-inc/core";
import {
  code,
  Messenger,
  Post,
  ProfessionPricelist,
  ProfessionPricelistRepository,
} from "@sotah-inc/server";
// @ts-ignore
import boll from "bollinger-bands";
import HTTPStatus from "http-status";
import moment from "moment";
import { ParsedQs } from "qs";
import { Connection } from "typeorm";

import {
  AuctionsQueryParamsRules,
  ItemsQueryParamRules,
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

    return {
      data: {
        ...bootResult,
        regions: regionComposites,
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

  public async getItem(itemId: ItemId): Promise<IRequestResult<GetItemResponse>> {
    const msg = await this.messenger.getItems([itemId]);
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

    const foundItem = itemsResult.items[itemId];
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
      case code.notFound:
        const notFoundValidationErrors: IValidationErrorResponse = {
          error: "could not resolve connected-realm",
        };

        return {
          data: notFoundValidationErrors,
          status: HTTPStatus.NOT_FOUND,
        };
      default:
        const defaultValidationErrors: IValidationErrorResponse = {
          error: "could not resolve connected-realm",
        };

        return {
          data: defaultValidationErrors,
          status: HTTPStatus.INTERNAL_SERVER_ERROR,
        };
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
            error: `${realmModificationDatesMessage.error!.message} (realm-modification-dates)`,
          },
          status: HTTPStatus.NOT_FOUND,
        };
      default:
        return {
          data: { error: realmModificationDatesMessage.error!.message },
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
        // tslint:disable-next-line:no-console
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

    const { count, page, sortDirection, sortKind, itemFilters } = validateParamsResult.data;

    // gathering auctions
    const auctionsMessage = await this.messenger.getAuctions({
      count,
      item_filters: itemFilters ?? [],
      page,
      sort_direction: sortDirection,
      sort_kind: sortKind,
      tuple: {
        connected_realm_id: resolveResult.connected_realm.connected_realm.id,
        region_name: regionName,
      },
    });
    switch (auctionsMessage.code) {
      case code.ok:
        break;
      case code.notFound:
        return {
          data: { error: `${auctionsMessage.error?.message ?? ""} (auctions)` },
          status: HTTPStatus.NOT_FOUND,
        };
      case code.userError:
        return {
          data: { error: auctionsMessage.error?.message ?? "" },
          status: HTTPStatus.BAD_REQUEST,
        };
      default:
        return {
          data: { error: auctionsMessage.error?.message ?? "" },
          status: HTTPStatus.INTERNAL_SERVER_ERROR,
        };
    }

    const auctionsResult = await auctionsMessage.decode();
    if (auctionsResult === null) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const itemIds = [...Array.from(new Set(auctionsResult.auctions.map(v => v.itemId)))];
    const itemsMsg = await this.messenger.getItems(itemIds);
    if (itemsMsg.code !== code.ok) {
      return {
        data: { error: itemsMsg.error?.message ?? "" },
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const itemsResult = await itemsMsg.decode();
    if (itemsResult === null) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const professionPricelists = await (async () => {
      if (itemsResult.items.length === 0) {
        return [];
      }

      return this.dbConn
        .getRepository(ProfessionPricelist)
        .createQueryBuilder("professionpricelist")
        .leftJoinAndSelect("professionpricelist.pricelist", "pricelist")
        .leftJoinAndSelect("pricelist.entries", "entry")
        .where(`entry.itemId IN (${itemIds.join(", ")})`)
        .getMany();
    })();

    const pricelistItemIds: ItemId[] = [
      ...professionPricelists.map(v => v.pricelist!.entries!.map(y => y.itemId)[0]),
    ];
    const pricelistItemsMsg = await this.messenger.getItems(pricelistItemIds);
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

    // tslint:disable-next-line:no-console
    console.log("serving un-cached request");

    return {
      data: {
        ...auctionsResult,
        items: [...itemsResult.items, ...pricelistItemsResult.items],
        professionPricelists: professionPricelists.map(v => v.toJson()),
      },
      headers: {
        "Cache-Control": ["public", `max-age=${60 * 30}`],
        "Last-Modified": lastModified,
      },
      status: HTTPStatus.OK,
    };
  }

  public async queryItems(query: ParsedQs): Promise<IRequestResult<QueryItemsResponse>> {
    // parsing request params
    const validateParamsResult = await validate(ItemsQueryParamRules, query);
    if (validateParamsResult.error || !validateParamsResult.data) {
      return {
        data: yupValidationErrorToResponse(validateParamsResult.error),
        status: HTTPStatus.BAD_REQUEST,
      };
    }

    // resolving items-query message
    const itemsQueryMessage = await this.messenger.queryItems({
      locale: validateParamsResult.data.locale as Locale,
      query: validateParamsResult.data.query ?? "",
    });
    if (itemsQueryMessage.code !== code.ok) {
      return {
        data: { error: itemsQueryMessage.error?.message ?? "" },
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }
    const itemsQueryResult = await itemsQueryMessage.decode();
    if (itemsQueryResult === null) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    // resolving items from item-ids in items-query response data
    const getItemsMessage = await this.messenger.getItems(
      itemsQueryResult.items.map(v => v.item_id),
    );
    if (getItemsMessage.code !== code.ok) {
      return {
        data: { error: itemsQueryMessage.error?.message ?? "" },
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }
    const getItemsResult = await getItemsMessage.decode();
    if (getItemsResult === null) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }
    const foundItems = getItemsResult.items;

    // formatting a response
    const data: IQueryItemsResponseData = {
      items: itemsQueryResult.items.map(v => {
        return {
          item: foundItems[v.item_id] ?? null,
          rank: v.rank,
          target: v.target,
        };
      }),
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
  ): Promise<IRequestResult<GetPricelistResponse>> {
    // resolving connected-realm
    const resolveMessage = await this.messenger.resolveConnectedRealm({
      realm_slug: realmSlug,
      region_name: regionName,
    });
    switch (resolveMessage.code) {
      case code.ok:
        break;
      case code.notFound:
        const notFoundValidationErrors: IValidationErrorResponse = {
          error: "could not resolve connected-realm",
        };

        return {
          data: notFoundValidationErrors,
          status: HTTPStatus.NOT_FOUND,
        };
      default:
        const defaultValidationErrors: IValidationErrorResponse = {
          error: "could not resolve connected-realm",
        };

        return {
          data: defaultValidationErrors,
          status: HTTPStatus.INTERNAL_SERVER_ERROR,
        };
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

    const itemsMessage = await this.messenger.getItems(itemIds);
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

  public async getPricelistHistories(
    regionName: RegionName,
    realmSlug: RealmSlug,
    itemIds: ItemId[],
  ): Promise<IRequestResult<GetPricelistHistoriesResponse>> {
    // resolving connected-realm
    const resolveMessage = await this.messenger.resolveConnectedRealm({
      realm_slug: realmSlug,
      region_name: regionName,
    });
    switch (resolveMessage.code) {
      case code.ok:
        break;
      case code.notFound:
        const notFoundValidationErrors: IValidationErrorResponse = {
          error: "could not resolve connected-realm",
        };

        return {
          data: notFoundValidationErrors,
          status: HTTPStatus.NOT_FOUND,
        };
      default:
        const defaultValidationErrors: IValidationErrorResponse = {
          error: "could not resolve connected-realm",
        };

        return {
          data: defaultValidationErrors,
          status: HTTPStatus.INTERNAL_SERVER_ERROR,
        };
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
    const historyMessage = await this.messenger.getPricelistHistories({
      item_ids: itemIds,
      lower_bounds: lowerBounds,
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
    const itemsMessage = await this.messenger.getItems(itemIds);
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

    // gathering unix timestamps for all items
    const historyUnixTimestamps: number[] = itemIds.reduce(
      (previousHistoryUnixTimestamps: number[], itemId) => {
        const itemHistory = foundHistory[itemId];
        if (typeof itemHistory === "undefined") {
          return previousHistoryUnixTimestamps;
        }

        const itemUnixTimestamps = Object.keys(itemHistory).map(Number);
        for (const itemUnixTimestamp of itemUnixTimestamps) {
          if (previousHistoryUnixTimestamps.indexOf(itemUnixTimestamp) > -1) {
            continue;
          }

          previousHistoryUnixTimestamps.push(itemUnixTimestamp);
        }

        return previousHistoryUnixTimestamps;
      },
      [],
    );

    // normalizing all histories to have zeroed data where missing
    const historyResult = itemIds.reduce<IItemPricelistHistoryMap<IPricesFlagged>>(
      (previousHistory, itemId) => {
        // generating a full zeroed pricelist-history for this item
        const currentItemHistory = foundHistory[itemId];
        if (typeof currentItemHistory === "undefined") {
          const blankItemHistory = historyUnixTimestamps.reduce<
            IPricelistHistoryMap<IPricesFlagged>
          >((previousBlankItemHistory, unixTimestamp) => {
            const blankPrices: IPricesFlagged = {
              average_buyout_per: 0,
              is_blank: true,
              max_buyout_per: 0,
              median_buyout_per: 0,
              min_buyout_per: 0,
              volume: 0,
            };

            return {
              ...previousBlankItemHistory,
              [unixTimestamp]: blankPrices,
            };
          }, {});

          return {
            ...previousHistory,
            [itemId]: blankItemHistory,
          };
        }

        // reforming the item-history with zeroed blank prices where none found
        const newItemHistory = historyUnixTimestamps.reduce<IPricelistHistoryMap<IPricesFlagged>>(
          (previousNewItemHistory, unixTimestamp) => {
            const itemHistoryAtTime = currentItemHistory[unixTimestamp];
            if (typeof itemHistoryAtTime === "undefined") {
              const blankPrices: IPricesFlagged = {
                average_buyout_per: 0,
                is_blank: true,
                max_buyout_per: 0,
                median_buyout_per: 0,
                min_buyout_per: 0,
                volume: 0,
              };

              return {
                ...previousNewItemHistory,
                [unixTimestamp]: blankPrices,
              };
            }

            return {
              ...previousNewItemHistory,
              [unixTimestamp]: {
                ...itemHistoryAtTime,
                is_blank: false,
              },
            };
          },
          {},
        );

        return {
          ...previousHistory,
          [itemId]: newItemHistory,
        };
      },
      {},
    );

    const itemPriceLimits = itemIds.reduce<IItemPriceLimits>((previousItemPriceLimits, itemId) => {
      const out: IPriceLimits = {
        lower: 0,
        upper: 0,
      };

      const itemPriceHistory = historyResult[itemId];
      if (typeof itemPriceHistory === "undefined") {
        return {
          ...previousItemPriceLimits,
          [itemId]: out,
        };
      }

      const itemPrices = Object.keys(itemPriceHistory).reduce<IPrices[]>(
        (itemPricesResult, itemIdString) => {
          const foundItemPrices = itemPriceHistory[Number(itemIdString)];
          if (typeof foundItemPrices === "undefined") {
            return itemPricesResult;
          }

          return [...itemPricesResult, foundItemPrices];
        },
        [],
      );
      if (itemPrices.length > 0) {
        const bands: IBollingerBands = boll(
          itemPrices.map(v => v.min_buyout_per),
          itemPrices.length > 4 ? 4 : itemPrices.length,
        );
        const minBandMid = bands.mid
          .filter(v => !!v)
          .reduce((previousValue, v) => {
            if (v === 0) {
              return previousValue;
            }

            if (previousValue === 0) {
              return v;
            }

            if (v < previousValue) {
              return v;
            }

            return previousValue;
          }, 0);
        const maxBandUpper = bands.upper
          .filter(v => !!v)
          .reduce((previousValue, v) => {
            if (v === 0) {
              return previousValue;
            }

            if (previousValue === 0) {
              return v;
            }

            if (v > previousValue) {
              return v;
            }

            return previousValue;
          }, 0);
        out.lower = minBandMid;
        out.upper = maxBandUpper;
      }

      return {
        ...previousItemPriceLimits,
        [itemId]: out,
      };
    }, {});

    const overallPriceLimits: IPriceLimits = { lower: 0, upper: 0 };
    overallPriceLimits.lower = itemIds.reduce((overallLower, itemId) => {
      const priceLimits = itemPriceLimits[itemId];
      if (typeof priceLimits === "undefined") {
        return overallLower;
      }

      if (priceLimits.lower === 0) {
        return overallLower;
      }
      if (overallLower === 0) {
        return priceLimits.lower;
      }

      if (priceLimits.lower < overallLower) {
        return priceLimits.lower;
      }

      return overallLower;
    }, 0);
    overallPriceLimits.upper = itemIds.reduce((overallUpper, itemId) => {
      const priceLimits = itemPriceLimits[itemId];
      if (typeof priceLimits === "undefined") {
        return overallUpper;
      }

      if (overallUpper > priceLimits.upper) {
        return overallUpper;
      }

      return priceLimits.upper;
    }, 0);

    return {
      data: { history: historyResult, items, itemPriceLimits, overallPriceLimits },
      status: HTTPStatus.OK,
    };
  }

  public async getUnmetDemand(
    regionName: RegionName,
    realmSlug: RealmSlug,
    expansionName: ExpansionName,
  ): Promise<IRequestResult<GetUnmetDemandResponse>> {
    // resolving connected-realm
    const resolveMessage = await this.messenger.resolveConnectedRealm({
      realm_slug: realmSlug,
      region_name: regionName,
    });
    switch (resolveMessage.code) {
      case code.ok:
        break;
      case code.notFound:
        const notFoundValidationErrors: IValidationErrorResponse = {
          error: "could not resolve connected-realm",
        };

        return {
          data: notFoundValidationErrors,
          status: HTTPStatus.NOT_FOUND,
        };
      default:
        const defaultValidationErrors: IValidationErrorResponse = {
          error: "could not resolve connected-realm",
        };

        return {
          data: defaultValidationErrors,
          status: HTTPStatus.INTERNAL_SERVER_ERROR,
        };
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
        const pricelistItemIds = v.pricelist!.entries!.map(entry => entry.itemId);
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
    const itemsMsg = await this.messenger.getItems(itemIds);
    if (itemsMsg.code !== code.ok) {
      return {
        data: { error: itemsMsg.error!.message },
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
        data: { error: pricelistMessage.error!.message },
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
      const unmetPricelistItemIds = v
        .pricelist!.entries!.map(entry => entry.itemId)
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
    professionName: ProfessionName,
    expansionName: ExpansionName,
  ): Promise<IRequestResult<GetProfessionPricelistsResponse>> {
    // gathering profession-pricelists
    const professionPricelists = await this.dbConn.getRepository(ProfessionPricelist).find({
      where: { name: professionName, expansion: expansionName },
    });

    // gathering related items
    const itemIds: ItemId[] = professionPricelists.reduce(
      (pricelistItemIds: ItemId[], professionPricelist) => {
        return professionPricelist.pricelist!.entries!.reduce((entryItemIds: ItemId[], entry) => {
          if (entryItemIds.indexOf(entry.itemId) === -1) {
            entryItemIds.push(entry.itemId);
          }

          return entryItemIds;
        }, pricelistItemIds);
      },
      [],
    );

    const itemsMessage = await this.messenger.getItems(itemIds);
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

  public async getTokenHistory(
    regionName: RegionName,
  ): Promise<IRequestResult<GetTokenHistoryResponse>> {
    const msg = await this.messenger.getTokenHistory({ region_name: regionName });
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
      data: { history: tokenHistoryResult },
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
    professionName: ProfessionName,
    expansionName: ExpansionName,
    pricelistSlug: string,
  ): Promise<IRequestResult<GetProfessionPricelistResponse>> {
    const professionPricelist = await this.dbConn
      .getCustomRepository(ProfessionPricelistRepository)
      .getFromPricelistSlug(professionName, expansionName, pricelistSlug);
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
