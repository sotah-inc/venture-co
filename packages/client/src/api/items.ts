import {
  GetItemResponse,
  IErrorResponse,
  IGetItemResponseData,
  IQueryRequest,
  IQueryResponseData,
  IShortItem,
  ItemId,
  QueryResponse,
} from "@sotah-inc/core";
import * as HTTPStatus from "http-status";

import { getApiEndpoint } from "./config";
import { gather, gatherWithQuery } from "./gather";

export async function getItems(req: IQueryRequest): Promise<IQueryResponseData<IShortItem> | null> {
  const { body, status } = await gatherWithQuery<IQueryRequest, QueryResponse<IShortItem>>({
    method: "GET",
    query: req,
    url: `${getApiEndpoint()}/items`,
  });
  if (status !== HTTPStatus.OK) {
    return null;
  }

  return body as IQueryResponseData<IShortItem>;
}

export interface IGetItemResult {
  item: IShortItem | null;
  error: string | null;
}

export async function getItem(itemId: ItemId): Promise<IGetItemResult> {
  const { body, status } = await gather<null, GetItemResponse>({
    method: "GET",
    url: `${getApiEndpoint()}/item/${itemId}`,
  });
  if (status !== HTTPStatus.OK) {
    return {
      error: (body as IErrorResponse).error,
      item: null,
    };
  }

  return {
    error: null,
    item: (body as IGetItemResponseData).item,
  };
}
