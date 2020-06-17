import { IValidationErrorResponse, UserLevel } from "@sotah-inc/core";
import { User } from "@sotah-inc/server";
import { Request, Response } from "express";
import * as HTTPStatus from "http-status";
import "passport";
import { ParsedQs } from "qs";
import { ObjectSchema } from "yup";

import { validate } from "../lib/validator-rules";

export { DataController } from "./data";

export interface IRequest<T> extends Request {
  body: T;
  user?: Express.User;
  params: {
    [key: string]: string;
  };
}

export interface IQueryRequest extends Request {
  body: null;
  user?: Express.User;
  params: {
    [key: string]: string;
  };
  query: ParsedQs;
}

export interface IRequestResult<T> {
  status: number;
  data: T;
  headers?: {
    [key: string]: string | string[];
  };
}

export type RequestHandler<T, A> = (req: IRequest<T>, res: Response) => Promise<IRequestResult<A>>;

export type QueryRequestHandler<A> = (
  req: IQueryRequest,
  res: Response,
) => Promise<IRequestResult<A>>;

export async function handle<T, A>(
  handlerFunc: RequestHandler<T, A>,
  req: IRequest<T>,
  res: Response,
) {
  const { status, data, headers } = await handlerFunc(req, res);

  res.status(status);
  if (headers) {
    res.set(headers);
  }
  res.send(data);
}

export function handleResult<T>(res: Response, { data, headers, status }: IRequestResult<T>) {
  res.status(status);
  if (headers) {
    res.set(headers);
  }
  res.send(data);
}

type ControllerDescriptor<T, A> = (
  req: IRequest<T>,
  res: Response,
) => Promise<IRequestResult<A | IValidationErrorResponse>>;

export function Validator<T extends object, A>(schema: ObjectSchema<T>) {
  return function validatorCallable(
    _target: any,
    _propertyKey: string,
    descriptor: TypedPropertyDescriptor<ControllerDescriptor<T, A>>,
  ) {
    const originalMethod = descriptor.value!;

    descriptor.value = async function (
      req,
      res,
    ): Promise<IRequestResult<A | IValidationErrorResponse>> {
      const result = await validate(schema, req.body);
      if (result.error || !result.data) {
        const validationErrors: IValidationErrorResponse = result.error
          ? { [result.error.path]: result.error.message }
          : {};

        return {
          data: validationErrors,
          status: HTTPStatus.BAD_REQUEST,
        };
      }

      req.body = result.data;

      /* tslint:disable-next-line:no-invalid-this */
      return originalMethod.apply(this, [req, res]);
    };

    return descriptor;
  };
}

export function Authenticator<T, A>(requiredLevel: UserLevel) {
  return function authenticatorCallable(
    _target: any,
    _propertyKey: string,
    descriptor: TypedPropertyDescriptor<ControllerDescriptor<T, A>>,
  ) {
    const originalMethod = descriptor.value!;

    descriptor.value = async function (
      req,
      res,
    ): Promise<IRequestResult<A | IValidationErrorResponse>> {
      const user = req.user as User;
      if (typeof user === "undefined" || user === null) {
        const validationErrors: IValidationErrorResponse = { unauthorized: "Unauthorized" };

        return { data: validationErrors, status: HTTPStatus.UNAUTHORIZED };
      }

      if (user.level < requiredLevel) {
        const validationErrors: IValidationErrorResponse = { unauthorized: "Unauthorized" };

        return { data: validationErrors, status: HTTPStatus.UNAUTHORIZED };
      }

      /* tslint:disable-next-line:no-invalid-this */
      return originalMethod.apply(this, [req, res]);
    };

    return descriptor;
  };
}
