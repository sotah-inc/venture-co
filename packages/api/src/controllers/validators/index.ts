import { IValidationErrorResponse } from "@sotah-inc/core";
import { Response } from "express";
import * as HTTPStatus from "http-status";
import * as yup from "yup";
import { z } from "zod";

import {
  IRequest,
  IRequestResult,
  IValidateResultError,
  StringMap,
  ValidateResult,
} from "../index";
import { validate as yupValidate } from "./yup";
import { validate as zodValidate } from "./zod";

type ValidatorSchema<T> = yup.Schema<T> | z.Schema<T>;

function isZodSchema<T>(schema: ValidatorSchema<T>): schema is z.Schema<T> {
  return "parse" in schema;
}

function isYupSchema<T>(schema: ValidatorSchema<T>): schema is yup.Schema<T> {
  return "clone" in schema;
}

export async function validate<T>(
  schema: ValidatorSchema<T>,
  payload: unknown,
): Promise<ValidateResult<T>> {
  if (isYupSchema(schema)) {
    return yupValidate(schema, payload);
  }

  if (isZodSchema(schema)) {
    return zodValidate(schema, payload);
  }

  throw new Error("failed to validate");
}

export function validationErrorsToResponse(
  errors: IValidateResultError[],
): IValidationErrorResponse {
  return errors.reduce<IValidationErrorResponse>((foundValidationErrors, error) => {
    return {
      ...foundValidationErrors,
      [error.path.join("_")]: error.message,
    };
  }, {});
}

export interface IValidatorOptions<T> {
  bodySchema?: ValidatorSchema<T>;
}

export function Validator<TRequest, TParams extends StringMap, TQuery extends StringMap, TResponse>(
  schema: ValidatorSchema<TRequest>,
) {
  return function (
    _target: unknown,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    descriptor.value = async function (
      req: IRequest<TRequest, TParams, TQuery>,
      res: Response,
    ): Promise<IRequestResult<TResponse | IValidationErrorResponse>> {
      const result = await validate(schema, req.body);
      if (result.errors !== null) {
        return {
          data: validationErrorsToResponse(result.errors),
          status: HTTPStatus.BAD_REQUEST,
        };
      }

      req.body = result.body;

      return descriptor.value(req, res);
    };

    return descriptor;
  };
}
