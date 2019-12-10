import {
  ExpansionName,
  ICreatePricelistRequest,
  ICreatePricelistResponse,
  ICreateProfessionPricelistRequest,
  ICreateProfessionPricelistResponse,
  IErrorResponse,
  IGetPricelistsResponse,
  IGetProfessionPricelistsResponse,
  IGetUnmetDemandRequest,
  IGetUnmetDemandResponse,
  IProfessionPricelistJson,
  IUpdatePricelistRequest,
  IUpdatePricelistResponse,
  IValidationErrorResponse,
  ProfessionName,
  RealmSlug,
  RegionName,
} from "@sotah-inc/core";
import * as HTTPStatus from "http-status";

import { apiEndpoint, gather } from "./index";

export interface ICreatePricelistResult {
  errors: IValidationErrorResponse | null;
  data: ICreatePricelistResponse | null;
}

export const createPricelist = async (
  token: string,
  request: ICreatePricelistRequest,
): Promise<ICreatePricelistResult> => {
  const { body, status } = await gather<
    ICreatePricelistRequest,
    ICreatePricelistResponse | IValidationErrorResponse
  >({
    body: request,
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    }),
    method: "POST",
    url: `${apiEndpoint}/user/pricelists`,
  });
  switch (status) {
    case HTTPStatus.CREATED:
      return { errors: null, data: body as ICreatePricelistResponse };
    case HTTPStatus.UNAUTHORIZED:
      return { errors: { error: "Unauthorized" }, data: null };
    case HTTPStatus.BAD_REQUEST:
    default:
      return { errors: body as IValidationErrorResponse, data: null };
  }
};

export interface IUpdatePricelistResult {
  errors: IValidationErrorResponse | null;
  data: IUpdatePricelistResponse | null;
}

export const updatePricelist = async (
  token: string,
  id: number,
  request: IUpdatePricelistRequest,
): Promise<IUpdatePricelistResult> => {
  const { body, status } = await gather<
    IUpdatePricelistRequest,
    IUpdatePricelistResponse | IValidationErrorResponse
  >({
    body: request,
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    }),
    method: "PUT",
    url: `${apiEndpoint}/user/pricelists/${id}`,
  });
  switch (status) {
    case HTTPStatus.OK:
      return { errors: null, data: body as IUpdatePricelistResponse };
    case HTTPStatus.UNAUTHORIZED:
      return { errors: { error: "Unauthorized" }, data: null };
    case HTTPStatus.BAD_REQUEST:
    default:
      return { errors: body as IValidationErrorResponse, data: null };
  }
};

export const getPricelists = async (token: string): Promise<IGetPricelistsResponse> => {
  const { body } = await gather<null, IGetPricelistsResponse>({
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    }),
    url: `${apiEndpoint}/user/pricelists`,
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
    url: `${apiEndpoint}/user/pricelists/${id}`,
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
  data: ICreateProfessionPricelistResponse | null;
}

export const createProfessionPricelist = async (
  token: string,
  request: ICreateProfessionPricelistRequest,
): Promise<ICreateProfessionPricelistResult> => {
  const { body, status } = await gather<
    ICreateProfessionPricelistRequest,
    ICreateProfessionPricelistResponse | IValidationErrorResponse
  >({
    body: request,
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    }),
    method: "POST",
    url: `${apiEndpoint}/user/profession-pricelists`,
  });
  switch (status) {
    case HTTPStatus.CREATED:
      return { errors: null, data: body as ICreateProfessionPricelistResponse };
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
    url: `${apiEndpoint}/user/profession-pricelists/${id}`,
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
  data: IGetProfessionPricelistsResponse | null;
  errors: IValidationErrorResponse | null;
}

export const getProfessionPricelists = async (
  profession: ProfessionName,
): Promise<IGetProfessionPricelistsResult> => {
  const { body, status } = await gather<null, IGetProfessionPricelistsResponse>({
    method: "GET",
    url: `${apiEndpoint}/profession-pricelists/${profession}`,
  });
  switch (status) {
    case HTTPStatus.OK:
      return { errors: null, data: body as IGetProfessionPricelistsResponse };
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
    url: `${apiEndpoint}/profession-pricelists/${profession}/${expansion}/${slug}`,
  });
  switch (status) {
    case HTTPStatus.OK:
      return { errors: null, data: body as IProfessionPricelistJson };
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
  data: IGetUnmetDemandResponse | null;
  errors: IErrorResponse | null;
}

export const getUnmetDemand = async (
  opts: IGetUnmetDemandOptions,
): Promise<IGetUnmetDemandResult> => {
  const { body, status } = await gather<
    IGetUnmetDemandRequest,
    IGetUnmetDemandResponse | IErrorResponse
  >({
    body: opts.request,
    headers: new Headers({ "content-type": "application/json" }),
    method: "POST",
    url: `${apiEndpoint}/region/${opts.region}/realm/${opts.realm}/unmet-demand`,
  });
  switch (status) {
    case HTTPStatus.OK:
      return { errors: null, data: body as IGetUnmetDemandResponse };
    default:
      return { data: null, errors: body as IErrorResponse };
  }
};
