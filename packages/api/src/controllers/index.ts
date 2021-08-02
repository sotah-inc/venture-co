import { IValidationErrorResponse, UserLevel } from "@sotah-inc/core";
import { User } from "@sotah-inc/server";
import { Request, Response } from "express";
import * as HTTPStatus from "http-status";
import "passport";

export { DataController } from "./data";

export type StringMap = { [k: string]: string };

export type EmptyStringMap = Record<string, never>;

export type PlainRequest = IRequest<undefined, EmptyStringMap, EmptyStringMap>;

export interface IRequest<TBody, TParams extends StringMap, TQuery extends StringMap>
  extends Request {
  body: TBody | undefined;
  user?: User;
  params: TParams;
  query: TQuery;
}

export interface IRequestResult<TResponse> {
  status: number;
  data: TResponse;
  headers?: {
    [key: string]: string | string[];
  };
}

export interface IValidateResultError {
  path: Array<string | number>;
  message: string;
}

export type ValidateResult<T> = { body: T; errors: null } | { errors: IValidateResultError[] };

export function handleResult<T>(res: Response, { data, headers, status }: IRequestResult<T>): void {
  res.status(status);
  if (headers) {
    res.set(headers);
  }
  res.send(data);
}

export function Authenticator<
  TRequest,
  TParams extends StringMap,
  TQuery extends StringMap,
  TResponse
>(requiredLevel: UserLevel) {
  return function (
    _target: unknown,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    descriptor.value = async function (
      req: IRequest<TRequest, TParams, TQuery>,
      res: TResponse,
    ): Promise<IRequestResult<TResponse | IValidationErrorResponse>> {
      const user = req.user;
      if (typeof user === "undefined") {
        return { data: { unauthorized: "Unauthenticated" }, status: HTTPStatus.UNAUTHORIZED };
      }

      if (user.level < requiredLevel) {
        return { data: { unauthorized: "Unauthorized" }, status: HTTPStatus.UNAUTHORIZED };
      }

      return descriptor.value(req, res);
    };

    return descriptor;
  };
}
