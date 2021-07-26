import { ItemRecipeKind, IValidationErrorResponse } from "@sotah-inc/core";
import * as HTTPStatus from "http-status";
import { z } from "zod";

import {
  ControllerDescriptor,
  IRequestResult,
  IValidateResultError,
  ValidateResult,
} from "../index";

export const ItemsRecipesQuery = z.object({
  locale: z.string(),
  itemIds: z.array(z.string()),
  kind: z.nativeEnum(ItemRecipeKind),
});

export const ItemsVendorPricesQuery = z.object({
  itemIds: z.array(z.string()),
});

export function validate<T>(schema: z.Schema<T>, data: unknown): ValidateResult<T> {
  try {
    const result = schema.parse(data);

    return {
      body: result,
      errors: null,
    };
  } catch (err) {
    if (!(err instanceof z.ZodError)) {
      throw new Error("error was not zod-error");
    }

    return {
      body: null,
      errors: err.issues.map<IValidateResultError>(v => {
        return {
          message: v.message,
          path: v.path,
        };
      }),
    };
  }
}

export function Validator<T, A>(schema: z.Schema<T>) {
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
      const result = validate(schema, req.body);
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
          "error": "result body was null",
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
