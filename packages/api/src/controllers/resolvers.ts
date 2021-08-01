import { IConnectedRealmComposite, IShortItem, IValidationErrorResponse } from "@sotah-inc/core";
import { ItemsMessenger, RegionsMessenger } from "@sotah-inc/server";
import { code } from "@sotah-inc/server/build/dist/messenger/contracts";
import HTTPStatus from "http-status";
import { z } from "zod";

import { validate, validationErrorsToResponse } from "./validators";
import { LocaleRule } from "./validators/zod";

import { IRequestResult } from "./index";

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
  params: ResolveParams,
  mess: ItemsMessenger,
): Promise<ResolveResult<IResolveItemResult>> {
  const validateResult = await validate(
    z
      .object({
        itemId: z.number(),
        locale: LocaleRule,
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

  const itemsMessage = await mess.items({
    itemIds: [validateResult.body.itemId],
    game_version: validateResult.body.gameVersion,
    locale: validateResult.body.locale,
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

  const foundItem = itemsResult.items.find(v => v.id === validateResult.body.itemId);
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
    },
  };
}
