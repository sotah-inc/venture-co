import {
  GameVersion,
  IConfigRegion,
  IConnectedRealmComposite,
  IConnectedRealmModificationDates,
  IRegionComposite,
  IRegionVersionConnectedRealmTuple,
  IShortItem,
  ItemId,
  IValidationErrorResponse,
  Locale,
} from "@sotah-inc/core";
import {
  IGetAuctionsRequest,
  IGetAuctionsResponse,
  IGetItemsResponse,
  IGetPetsResponse,
  ItemsMessenger,
  LiveAuctionsMessenger,
  Post,
  PostRepository,
  RegionsMessenger,
  User,
} from "@sotah-inc/server";
import { code } from "@sotah-inc/server/build/dist/messenger/contracts";
import HTTPStatus from "http-status";
import { Connection } from "typeorm";
import { z } from "zod";

import { validate, validationErrorsToResponse } from "./validators";
import { createSchema, PostIdRule } from "./validators/yup";

import { IRequestResult, StringMap, UnauthenticatedUserResponse } from "./index";

type ResolveParams = {
  [key: string]: string;
};

export type ResolveResult<TData> =
  | {
      errorResponse: null;
      data: TData;
    }
  | {
      errorResponse: IRequestResult<IValidationErrorResponse>;
    };

export async function resolveWriteablePost(
  dbConn: Connection,
  params: StringMap,
  user: User | undefined,
): Promise<ResolveResult<Post>> {
  const resolveUserIdResult = resolveUserId(user);
  if (resolveUserIdResult.errorResponse !== null) {
    return {
      errorResponse: resolveUserIdResult.errorResponse,
    };
  }

  const validateParamsResult = await validate(
    createSchema({
      post_id: PostIdRule,
    }),
    params,
  );
  if (validateParamsResult.errors !== null) {
    return {
      errorResponse: {
        status: HTTPStatus.BAD_REQUEST,
        data: validationErrorsToResponse(validateParamsResult.errors),
      },
    };
  }

  const post = await dbConn
    .getCustomRepository(PostRepository)
    .getWithUser(validateParamsResult.body.post_id);
  if (post === null) {
    const validationResponse: IValidationErrorResponse = {
      notFound: "Not Found",
    };

    return {
      errorResponse: {
        data: validationResponse,
        status: HTTPStatus.NOT_FOUND,
      },
    };
  }

  if (post.user === undefined) {
    return {
      errorResponse: {
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
        data: { error: "post user was undefined" },
      },
    };
  }
  if (post.user.id === undefined) {
    return {
      errorResponse: {
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
        data: { error: "post user-id was undefined" },
      },
    };
  }

  if (post.user.id !== resolveUserIdResult.data) {
    return {
      errorResponse: {
        data: {
          unauthorized: "Unauthorized",
        },
        status: HTTPStatus.UNAUTHORIZED,
      },
    };
  }

  return {
    data: post,
    errorResponse: null,
  };
}

export function resolveUserId(user: User | undefined): ResolveResult<string> {
  if (user === undefined) {
    return { errorResponse: UnauthenticatedUserResponse };
  }

  const userId = user.id;
  if (userId === undefined) {
    return {
      errorResponse: {
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
        data: { error: "user-id was undefined" },
      },
    };
  }

  return { data: userId, errorResponse: null };
}

export interface IResolveUserResult {
  user: User;
  id: string;
}

export function resolveUser(user: User | undefined): ResolveResult<IResolveUserResult> {
  if (user === undefined) {
    return { errorResponse: UnauthenticatedUserResponse };
  }

  const userId = user.id;
  if (userId === undefined) {
    return {
      errorResponse: {
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
        data: { error: "user-id was undefined" },
      },
    };
  }

  return {
    data: {
      user,
      id: userId,
    },
    errorResponse: null,
  };
}

export async function resolveRegionComposites(
  regions: IConfigRegion[],
  gameVersion: GameVersion,
  mess: RegionsMessenger,
): Promise<ResolveResult<IRegionComposite[]>> {
  const regionCompositeResults = await Promise.all(
    regions.map(configRegion => {
      return new Promise<IRegionComposite | null>((resolve, reject) => {
        mess
          .connectedRealms({
            region_name: configRegion.name,
            game_version: gameVersion,
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
  const regionComposites = regionCompositeResults.reduce<IRegionComposite[] | null>((result, v) => {
    if (result === null) {
      return null;
    }

    if (v === null) {
      return null;
    }

    return [...result, v];
  }, []);
  if (regionComposites === null) {
    return {
      errorResponse: {
        data: { error: "could not resolve region-composites" },
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      },
    };
  }

  return {
    errorResponse: null,
    data: regionComposites,
  };
}

export async function resolveGameVersion(
  gameVersion: string,
  mess: RegionsMessenger,
): Promise<ResolveResult<null>> {
  const validateGameVersionMsg = await mess.validateGameVersion({
    game_version: gameVersion,
  });
  switch (validateGameVersionMsg.code) {
  case code.ok:
    break;
  case code.notFound: {
    return {
      errorResponse: {
        data: {
          error: "game-version not found",
        },
        status: HTTPStatus.NOT_FOUND,
      },
    };
  }
  default: {
    return {
      errorResponse: {
        data: {
          error: "could not resolve connected-realm",
        },
        status: HTTPStatus.NOT_FOUND,
      },
    };
  }
  }
  const validateGameVersionResult = await validateGameVersionMsg.decode();
  if (validateGameVersionResult === null) {
    return {
      errorResponse: {
        data: {
          error: "could not validate game-version",
        },
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      },
    };
  }

  return {
    errorResponse: null,
    data: null,
  };
}

export interface IResolveItemResult {
  item: IShortItem;
}

export async function resolveItem(
  gameVersion: GameVersion,
  locale: Locale,
  itemId: ItemId,
  mess: ItemsMessenger,
): Promise<ResolveResult<IResolveItemResult>> {
  const itemsMessage = await mess.items({
    itemIds: [itemId],
    game_version: gameVersion,
    locale,
  });
  switch (itemsMessage.code) {
  case code.notFound:
    return {
      errorResponse: {
        status: HTTPStatus.NOT_FOUND,
        data: {
          error: "item not found",
        },
      },
    };
  case code.ok:
    break;
  default:
    return {
      errorResponse: {
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
        data: {
          error: "failed to resolve items message",
        },
      },
    };
  }

  const itemsResult = await itemsMessage.decode();
  if (itemsResult === null) {
    return {
      errorResponse: {
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
        data: {
          error: "failed to decode items message",
        },
      },
    };
  }

  const foundItem = itemsResult.items.find(v => v.id === itemId);
  if (foundItem === undefined) {
    return {
      errorResponse: {
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
        data: {
          error: "item was not in message data",
        },
      },
    };
  }

  return {
    data: {
      item: foundItem,
    },
    errorResponse: null,
  };
}

export interface IResolveRealmSlugResult {
  gameVersion: string;
  regionName: string;
  connectedRealm: IConnectedRealmComposite;
  tuple: IRegionVersionConnectedRealmTuple;
}

export async function resolveRealmSlug(
  params: ResolveParams,
  mess: RegionsMessenger,
): Promise<ResolveResult<IResolveRealmSlugResult>> {
  const validateResult = await validate(
    z
      .object({
        realmSlug: z.string().nonempty(),
        regionName: z.string().nonempty(),
        gameVersion: z.string().nonempty(),
      })
      .required(),
    params,
  );
  if (validateResult.errors !== null) {
    return {
      errorResponse: {
        status: HTTPStatus.BAD_REQUEST,
        data: validationErrorsToResponse(validateResult.errors),
      },
    };
  }

  const resolveMessage = await mess.resolveConnectedRealm({
    realm_slug: validateResult.body.realmSlug,
    region_name: validateResult.body.regionName,
    game_version: validateResult.body.gameVersion,
  });
  switch (resolveMessage.code) {
  case code.ok:
    break;
  case code.notFound: {
    return {
      errorResponse: {
        data: {
          error: "connected-realm not found",
        },
        status: HTTPStatus.NOT_FOUND,
      },
    };
  }
  default: {
    return {
      errorResponse: {
        data: {
          error: "could not resolve connected-realm",
        },
        status: HTTPStatus.NOT_FOUND,
      },
    };
  }
  }

  const resolveResult = await resolveMessage.decode();
  if (resolveResult === null) {
    return {
      errorResponse: {
        data: {
          error: "could not decode connected-realm message",
        },
        status: HTTPStatus.NOT_FOUND,
      },
    };
  }

  return {
    errorResponse: null,
    data: {
      connectedRealm: resolveResult.connected_realm,
      gameVersion: validateResult.body.gameVersion,
      regionName: validateResult.body.regionName,
      tuple: {
        connected_realm_id: resolveResult.connected_realm.connected_realm.id,
        region_name: validateResult.body.regionName,
        game_version: validateResult.body.gameVersion,
      },
    },
  };
}

export interface IResolveRealmModificationDatesResult {
  dates: IConnectedRealmModificationDates;
}

export async function resolveRealmModificationDates(
  tuple: IRegionVersionConnectedRealmTuple,
  mess: RegionsMessenger,
): Promise<ResolveResult<IResolveRealmModificationDatesResult>> {
  const realmModificationDatesMessage = await mess.queryRealmModificationDates(tuple);
  switch (realmModificationDatesMessage.code) {
  case code.ok:
    break;
  case code.notFound:
    return {
      errorResponse: {
        data: {
          error: `${realmModificationDatesMessage.error?.message} (realm-modification-dates)`,
        },
        status: HTTPStatus.NOT_FOUND,
      },
    };
  default:
    return {
      errorResponse: {
        data: { error: realmModificationDatesMessage.error?.message },
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      },
    };
  }

  const realmModificationDatesResult = await realmModificationDatesMessage.decode();
  if (realmModificationDatesResult === null) {
    return {
      errorResponse: {
        data: { error: "could not decode realm-modification-dates response" },
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      },
    };
  }

  return {
    errorResponse: null,
    data: {
      dates: realmModificationDatesResult,
    },
  };
}

export interface IResolveAuctionsResult {
  response: {
    auctions: IGetAuctionsResponse;
    items: IGetItemsResponse;
    pets: IGetPetsResponse;
  };
}

export async function resolveAuctions(
  req: IGetAuctionsRequest,
  locale: Locale,
  mess: LiveAuctionsMessenger,
): Promise<ResolveResult<IResolveAuctionsResult>> {
  const resolveAuctionsResponse = await mess.resolveAuctions(req, locale);
  switch (resolveAuctionsResponse.code) {
  case code.ok:
    break;
  case code.notFound:
    return {
      errorResponse: {
        data: { error: `${resolveAuctionsResponse.error ?? ""} (auctions)` },
        status: HTTPStatus.NOT_FOUND,
      },
    };
  case code.userError:
    return {
      errorResponse: {
        data: { error: resolveAuctionsResponse.error ?? "" },
        status: HTTPStatus.BAD_REQUEST,
      },
    };
  default:
    return {
      errorResponse: {
        data: { error: resolveAuctionsResponse.error ?? "" },
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      },
    };
  }

  if (resolveAuctionsResponse.data === null) {
    return {
      errorResponse: {
        data: { error: resolveAuctionsResponse.error ?? "" },
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      },
    };
  }

  return {
    errorResponse: null,
    data: {
      response: resolveAuctionsResponse.data,
    },
  };
}
