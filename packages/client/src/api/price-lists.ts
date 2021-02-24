import {
  CreatePricelistResponse,
  CreateProfessionPricelistResponse,
  ExpansionName,
  GetPricelistsResponse,
  GetProfessionPricelistsResponse,
  GetUnmetDemandResponse,
  ICreatePricelistRequest,
  ICreatePricelistResponseData,
  ICreateProfessionPricelistRequest,
  ICreateProfessionPricelistResponseData,
  IErrorResponse,
  IGetPricelistsResponseData,
  IGetProfessionPricelistsResponseData,
  IGetUnmetDemandRequest,
  IGetUnmetDemandResponseData,
  IPricelistJson,
  IProfessionPricelistJson,
  IValidationErrorResponse,
  Locale, ProfessionId,
  RealmSlug,
  RegionName,
  UpdatePricelistRequest,
  UpdatePricelistResponse,
} from "@sotah-inc/core";
import * as HTTPStatus from "http-status";

import { getApiEndpoint } from "./config";
import { gather, gatherWithQuery } from "./gather";

export interface ICreatePricelistResult {
  errors: IValidationErrorResponse | null;
  data: ICreatePricelistResponseData | null;
}

export async function createPricelist(
  token: string,
  request: ICreatePricelistRequest,
): Promise<ICreatePricelistResult> {
  const { body, status } = await gather<ICreatePricelistRequest, CreatePricelistResponse>({
    body: request,
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    }),
    method: "POST",
    url: `${getApiEndpoint()}/user/pricelists`,
  });
  switch (status) {
  case HTTPStatus.CREATED:
    return { errors: null, data: body as ICreatePricelistResponseData };
  case HTTPStatus.UNAUTHORIZED:
    return { errors: { error: "Unauthorized" }, data: null };
  case HTTPStatus.BAD_REQUEST:
  default:
    return { errors: body as IValidationErrorResponse, data: null };
  }
}

export interface IUpdatePricelistResult {
  errors: IValidationErrorResponse | null;
  data: ICreatePricelistResponseData | null;
}

export async function updatePricelist(
  token: string,
  id: number,
  request: UpdatePricelistRequest,
): Promise<IUpdatePricelistResult> {
  const { body, status } = await gather<UpdatePricelistRequest, UpdatePricelistResponse>({
    body: request,
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    }),
    method: "PUT",
    url: `${getApiEndpoint()}/user/pricelists/${id}`,
  });
  switch (status) {
  case HTTPStatus.OK:
    return { errors: null, data: body as ICreatePricelistResponseData };
  case HTTPStatus.UNAUTHORIZED:
    return { errors: { error: "Unauthorized" }, data: null };
  case HTTPStatus.BAD_REQUEST:
  default:
    return { errors: body as IValidationErrorResponse, data: null };
  }
}

export async function getPricelists(
  token: string,
  req: { locale: Locale },
): Promise<IGetPricelistsResponseData | null> {
  const { body, status } = await gatherWithQuery<{ locale: Locale }, GetPricelistsResponse>({
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    }),
    query: req,
    url: `${getApiEndpoint()}/user/pricelists`,
  });

  if (status !== HTTPStatus.OK) {
    return null;
  }

  return body as IGetPricelistsResponseData;
}

export async function deletePricelist(token: string, id: number): Promise<number | null> {
  const { status } = await gather<null, null>({
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    }),
    method: "DELETE",
    url: `${getApiEndpoint()}/user/pricelists/${id}`,
  });
  switch (status) {
  case HTTPStatus.OK:
    return id;
  default:
    return null;
  }
}
export interface ICreateProfessionPricelistResult {
  errors: IValidationErrorResponse | null;
  data: ICreateProfessionPricelistResponseData | null;
}

export async function createProfessionPricelist(
  token: string,
  request: ICreateProfessionPricelistRequest,
): Promise<ICreateProfessionPricelistResult> {
  const { body, status } = await gather<
    ICreateProfessionPricelistRequest,
    CreateProfessionPricelistResponse
  >({
    body: request,
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    }),
    method: "POST",
    url: `${getApiEndpoint()}/user/profession-pricelists`,
  });
  switch (status) {
  case HTTPStatus.CREATED:
    return { errors: null, data: body as ICreateProfessionPricelistResponseData };
  case HTTPStatus.UNAUTHORIZED:
    return { errors: { error: "Unauthorized" }, data: null };
  case HTTPStatus.BAD_REQUEST:
  default:
    return { errors: body as IValidationErrorResponse, data: null };
  }
}

export interface IDeleteProfessionPricelistResult {
  id: number;
  errors: IValidationErrorResponse | null;
}

export async function deleteProfessionPricelist(
  token: string,
  id: number,
): Promise<IDeleteProfessionPricelistResult> {
  const { body, status } = await gather<null, IValidationErrorResponse | null>({
    headers: new Headers({ Authorization: `Bearer ${token}`, "content-type": "application/json" }),
    method: "DELETE",
    url: `${getApiEndpoint()}/user/profession-pricelists/${id}`,
  });
  switch (status) {
  case HTTPStatus.OK:
    return { id, errors: null };
  case HTTPStatus.INTERNAL_SERVER_ERROR:
    return { id, errors: body };
  default:
    return { id, errors: { error: `Unexpected status code: ${status}` } };
  }
}

export interface IGetProfessionPricelistsResult {
  data: IGetProfessionPricelistsResponseData | null;
  errors: IValidationErrorResponse | null;
}

export async function getProfessionPricelists(
  professionId: ProfessionId,
  expansion: ExpansionName,
  locale: Locale,
): Promise<IGetProfessionPricelistsResult> {
  const { body, status } = await gatherWithQuery<
    { locale: Locale },
    GetProfessionPricelistsResponse
  >({
    method: "GET",
    query: { locale },
    url: `${getApiEndpoint()}/profession-pricelists/${professionId}/${expansion}`,
  });
  switch (status) {
  case HTTPStatus.OK:
    return { errors: null, data: body as IGetProfessionPricelistsResponseData };
  default:
    return { data: null, errors: { failure: "Failed to fetch profession-pricelists" } };
  }
}

export interface IGetProfessionPricelistResult {
  errors: IValidationErrorResponse | null;
  data: IProfessionPricelistJson | null;
}

export async function getProfessionPricelist(
  professionId: ProfessionId,
  expansion: ExpansionName,
  slug: string,
  locale: Locale,
): Promise<IGetProfessionPricelistResult> {
  const { body, status } = await gatherWithQuery<
    { locale: Locale },
    IProfessionPricelistJson | IValidationErrorResponse | null
  >({
    method: "GET",
    query: { locale },
    url: `${getApiEndpoint()}/profession-pricelists/${professionId}/${expansion}/${slug}`,
  });
  switch (status) {
  case HTTPStatus.OK:
    return { errors: null, data: body as IProfessionPricelistJson };
  default:
    return { data: null, errors: { failure: "Failed to fetch profession-pricelists" } };
  }
}

export interface IGetPricelistResult {
  errors: IValidationErrorResponse | null;
  data: IPricelistJson | null;
}

export async function getUserPricelist(token: string, slug: string): Promise<IGetPricelistResult> {
  const { body, status } = await gather<null, IPricelistJson | IValidationErrorResponse | null>({
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    }),
    method: "GET",
    url: `${getApiEndpoint()}/user/pricelists/${slug}`,
  });
  switch (status) {
  case HTTPStatus.OK:
    return { errors: null, data: body as IPricelistJson };
  default:
    return { data: null, errors: { failure: "Failed to fetch profession-pricelists" } };
  }
}

export interface IGetUnmetDemandOptions {
  region: RegionName;
  realm: RealmSlug;
  request: IGetUnmetDemandRequest;
  locale: Locale;
}

export interface IGetUnmetDemandResult {
  data: IGetUnmetDemandResponseData | null;
  errors: IErrorResponse | IValidationErrorResponse | null;
}

export async function getUnmetDemand(opts: IGetUnmetDemandOptions): Promise<IGetUnmetDemandResult> {
  const { body, status } = await gatherWithQuery<
    { locale: Locale },
    GetUnmetDemandResponse,
    IGetUnmetDemandRequest
  >({
    body: opts.request,
    headers: new Headers({ "content-type": "application/json" }),
    method: "POST",
    query: { locale: opts.locale },
    url: `${getApiEndpoint()}/unmet-demand/${opts.region}/${opts.realm}`,
  });
  switch (status) {
  case HTTPStatus.OK:
    return { errors: null, data: body as IGetUnmetDemandResponseData };
  case HTTPStatus.NOT_FOUND:
    return { data: null, errors: body as IValidationErrorResponse };
  default:
    return { data: null, errors: body as IErrorResponse };
  }
}
