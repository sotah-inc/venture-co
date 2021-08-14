import { IValidationErrorResponse, UserLevel } from "@sotah-inc/core";
import { Request, Response } from "express";
import * as HTTPStatus from "http-status";
import "passport";
import { ParsedQs } from "qs";

export { DataController } from "./data";

export const UnauthenticatedUserResponse: IRequestResult<IValidationErrorResponse> = {
  status: HTTPStatus.UNAUTHORIZED,
  data: {
    error: "unauthenticated user",
  },
};

export const EmptyRequestBodyResponse: IRequestResult<IValidationErrorResponse> = {
  status: HTTPStatus.BAD_REQUEST,
  data: {
    error: "missing request body",
  },
};

export type StringMap = { [k: string]: string };

export type PlainRequest = IRequest<undefined, StringMap>;

export type AuthenticatedRequest<TBody, TParams extends StringMap> = IRequest<TBody, TParams>;

export type UnauthenticatedRequest<TBody, TParams extends StringMap> = IRequest<TBody, TParams>;

export interface IRequest<TBody, TParams extends StringMap> extends Request {
  body: TBody | undefined;
  params: TParams;
  query: ParsedQs;
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

export function Authenticator(requiredLevel: UserLevel) {
  return function (
    _target: unknown,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    descriptor.value = async function <TRequest, TParams extends StringMap, TResponse>(
      req: IRequest<TRequest, TParams>,
      res: TResponse,
    ): Promise<IRequestResult<TResponse | IValidationErrorResponse>> {
      const user = req.sotahUser;
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
