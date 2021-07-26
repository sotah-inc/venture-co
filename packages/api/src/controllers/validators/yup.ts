import { IValidationErrorResponse } from "@sotah-inc/core";
import * as HTTPStatus from "http-status";
import { ObjectSchema } from "yup";

import { validate } from "../../lib/validator-rules";
import { ControllerDescriptor, IRequestResult } from "../index";

// eslint-disable-next-line @typescript-eslint/ban-types
export function YupValidator<T extends object, A>(schema: ObjectSchema<T>) {
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
