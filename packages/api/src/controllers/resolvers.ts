import { IConnectedRealmComposite, IValidationErrorResponse } from "@sotah-inc/core";
import { RegionsMessenger } from "@sotah-inc/server";
import { code } from "@sotah-inc/server/build/dist/messenger/contracts";
import HTTPStatus from "http-status";

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

export interface IResolveRealmSlugResult {
  gameVersion: string;
  regionName: string;
  connectedRealm: IConnectedRealmComposite;
}

export async function resolveRealmSlug(
  params: ResolveParams,
  mess: RegionsMessenger,
): Promise<ResolveResult<IResolveRealmSlugResult>> {
  const { realmSlug, regionName, gameVersion } = params;

  const validateMessage = await mess.validateGameVersion({ game_version: gameVersion });
  switch (validateMessage.code) {
  case code.ok:
    break;
  case code.notFound: {
    return {
      errorResponse: {
        data: {
          error: "could not resolve connected-realm",
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
  const validateResult = await validateMessage.decode();
  if (validateResult === null) {
    return {
      errorResponse: {
        data: {
          error: "could not validate game-version",
        },
        status: HTTPStatus.NOT_FOUND,
      },
    };
  }

  const resolveMessage = await mess.resolveConnectedRealm({
    realm_slug: realmSlug,
    region_name: regionName,
    game_version: gameVersion,
  });
  switch (resolveMessage.code) {
  case code.ok:
    break;
  case code.notFound: {
    return {
      errorResponse: {
        data: {
          error: "could not resolve connected-realm",
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
      gameVersion,
      regionName,
    },
  };
}
