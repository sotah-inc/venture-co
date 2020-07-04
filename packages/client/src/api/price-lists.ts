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
  ProfessionName,
  RealmSlug,
  RegionName,
  UpdatePricelistRequest,
  UpdatePricelistResponse,
} from "@sotah-inc/core";
import * as HTTPStatus from "http-status";

import { gather, getApiEndpoint } from "./index";

export interface ICreatePricelistResult {
  errors: IValidationErrorResponse | null;
  data: ICreatePricelistResponseData | null;
}

export const createPricelist = async (
  token: string,
  request: ICreatePricelistRequest,
): Promise<ICreatePricelistResult> => {
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
};

export interface IUpdatePricelistResult {
  errors: IValidationErrorResponse | null;
  data: ICreatePricelistResponseData | null;
}

export const updatePricelist = async (
  token: string,
  id: number,
  request: UpdatePricelistRequest,
): Promise<IUpdatePricelistResult> => {
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
};

export const getPricelists = async (token: string): Promise<IGetPricelistsResponseData> => {
  const { body } = await gather<null, GetPricelistsResponse>({
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    }),
    url: `${getApiEndpoint()}/user/pricelists`,
  });

  return body!;
};

export const deletePricelist = async (token: string, id: number): Promise<number | null> => {
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
};
export interface ICreateProfessionPricelistResult {
  errors: IValidationErrorResponse | null;
  data: ICreateProfessionPricelistResponseData | null;
}

export const createProfessionPricelist = async (
  token: string,
  request: ICreateProfessionPricelistRequest,
): Promise<ICreateProfessionPricelistResult> => {
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
};

export interface IDeleteProfessionPricelistResult {
  id: number;
  errors: IValidationErrorResponse | null;
}

export const deleteProfessionPricelist = async (
  token: string,
  id: number,
): Promise<IDeleteProfessionPricelistResult> => {
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
};

export interface IGetProfessionPricelistsResult {
  data: IGetProfessionPricelistsResponseData | null;
  errors: IValidationErrorResponse | null;
}

export const getProfessionPricelists = async (
  profession: ProfessionName,
  expansion: ExpansionName,
): Promise<IGetProfessionPricelistsResult> => {
  const { body, status } = await gather<null, GetProfessionPricelistsResponse>({
    method: "GET",
    url: `${getApiEndpoint()}/profession-pricelists/${profession}/${expansion}`,
  });
  switch (status) {
    case HTTPStatus.OK:
      return { errors: null, data: body as IGetProfessionPricelistsResponseData };
    default:
      return { data: null, errors: { failure: "Failed to fetch profession-pricelists" } };
  }
};

export interface IGetProfessionPricelistResult {
  errors: IValidationErrorResponse | null;
  data: IProfessionPricelistJson | null;
}

export const getProfessionPricelist = async (
  profession: ProfessionName,
  expansion: ExpansionName,
  slug: string,
): Promise<IGetProfessionPricelistResult> => {
  const { body, status } = await gather<
    null,
    IProfessionPricelistJson | IValidationErrorResponse | null
  >({
    method: "GET",
    url: `${getApiEndpoint()}/profession-pricelists/${profession}/${expansion}/${slug}`,
  });
  switch (status) {
    case HTTPStatus.OK:
      return { errors: null, data: body as IProfessionPricelistJson };
    default:
      return { data: null, errors: { failure: "Failed to fetch profession-pricelists" } };
  }
};

export interface IGetPricelistResult {
  errors: IValidationErrorResponse | null;
  data: IPricelistJson | null;
}

export const getUserPricelist = async (
  token: string,
  slug: string,
): Promise<IGetPricelistResult> => {
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
};

export interface IGetUnmetDemandOptions {
  region: RegionName;
  realm: RealmSlug;
  request: IGetUnmetDemandRequest;
}

export interface IGetUnmetDemandResult {
  data: IGetUnmetDemandResponseData | null;
  errors: IErrorResponse | null;
}

export const getUnmetDemand = async (
  opts: IGetUnmetDemandOptions,
): Promise<IGetUnmetDemandResult> => {
  const { body, status } = await gather<IGetUnmetDemandRequest, GetUnmetDemandResponse>({
    body: opts.request,
    headers: new Headers({ "content-type": "application/json" }),
    method: "POST",
    url: `${getApiEndpoint()}/region/${opts.region}/realm/${opts.realm}/unmet-demand`,
  });
  switch (status) {
    case HTTPStatus.OK:
      return { errors: null, data: body as IGetUnmetDemandResponseData };
    default:
      return { data: null, errors: body as IErrorResponse };
  }
};
