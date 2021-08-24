import { IValidationErrorResponse, UserLevel } from "@sotah-inc/core";
import { User as SotahUser } from "@sotah-inc/server";
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

export type User = SotahUser | undefined;

export type PlainRequest = IRequest<undefined>;

export interface IRequest<TBody> extends Request {
  body: TBody | undefined;
  params: StringMap;
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

export interface IAuthenticatorSettings {
  exact: boolean;
}

const defaultAuthenticatorSettings: IAuthenticatorSettings = {
  exact: true,
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function Authenticator(requiredLevel: UserLevel, opts?: Partial<IAuthenticatorSettings>) {
  const settings: IAuthenticatorSettings = {
    ...defaultAuthenticatorSettings,
    ...opts,
  };

  return function (
    _target: unknown,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    descriptor.value = async function <TRequest, TResponse>(
      req: IRequest<TRequest>,
      res: TResponse,
    ): Promise<IRequestResult<TResponse | IValidationErrorResponse>> {
      const user = req.sotahUser;
      if (typeof user === "undefined") {
        return { data: { unauthorized: "Unauthenticated" }, status: HTTPStatus.UNAUTHORIZED };
      }

      if (settings.exact ? user.level === requiredLevel : user.level < requiredLevel) {
        return { data: { unauthorized: "Unauthorized" }, status: HTTPStatus.UNAUTHORIZED };
      }

      return descriptor.value(req, res);
    };

    return descriptor;
  };
}

export function UnauthenticatedOnly() {
  return function (
    _target: unknown,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    descriptor.value = async function <TRequest, TResponse>(
      req: IRequest<TRequest>,
      res: TResponse,
    ): Promise<IRequestResult<TResponse | IValidationErrorResponse>> {
      const user = req.sotahUser;
      if (typeof user !== "undefined") {
        return { data: { unauthorized: "Unauthorized" }, status: HTTPStatus.UNAUTHORIZED };
      }

      return descriptor.value(req, res);
    };

    return descriptor;
  };
}
