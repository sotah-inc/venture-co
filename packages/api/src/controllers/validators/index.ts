import { IValidationErrorResponse } from "@sotah-inc/core";
import * as HTTPStatus from "http-status";
import * as yup from "yup";
import { z } from "zod";

import { ControllerDescriptor, IRequestResult, ValidateResult } from "../index";
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

export function Validator<T, A>(schema: ValidatorSchema<T>) {
  return function validatorCallable(
    _target: unknown,
    _propertyKey: string,
    descriptor: TypedPropertyDescriptor<ControllerDescriptor<T, A>>,
  ): TypedPropertyDescriptor<ControllerDescriptor<T, A>> {
    const originalMethod = descriptor.value;
    if (originalMethod === undefined) {
      return descriptor;
    }

    descriptor.value = async function (
      req,
      res,
    ): Promise<IRequestResult<A | IValidationErrorResponse>> {
      const result = await validate(schema, req.body);
      if (result.errors) {
        const validationErrors = result.errors.reduce<IValidationErrorResponse>(
          (foundValidationErrors, error) => {
            return {
              ...foundValidationErrors,
              [error.path.join("_")]: error.message,
            };
          },
          {},
        );

        return {
          data: validationErrors,
          status: HTTPStatus.BAD_REQUEST,
        };
      }
      if (result.body === null) {
        const validationErrors: IValidationErrorResponse = {
          error: "result body was null",
        };

        return {
          data: validationErrors,
          status: HTTPStatus.BAD_REQUEST,
        };
      }

      req.body = result.body;

      /* tslint:disable-next-line:no-invalid-this */
      return originalMethod.apply(this, [req, res]);
    };

    return descriptor;
  };
}
