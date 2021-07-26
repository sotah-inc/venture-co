import {
  ICreatePostRequest,
  ICreatePreferencesRequest,
  ICreateUserRequest,
  ICreateWorkOrderRequest,
  IGetAuctionsRequest,
  IQueryRequest,
  ISaveLastPathRequest,
  IValidationErrorResponse,
} from "@sotah-inc/core";
import { IFindByOptions, PostRepository, RegionsMessenger } from "@sotah-inc/server";
import * as HTTPStatus from "http-status";
import * as yup from "yup";

import {
  GameVersionRule,
  LocaleRule, OrderDirectionRule,
  OrderKindRule, PerPageRule,
  SlugRule,
} from "../../lib/validator-rules/params";
import { ControllerDescriptor, IRequestResult, ValidateResult } from "../index";

export const PreferenceRules = yup
  .object<ICreatePreferencesRequest>({
    current_realm: yup.string().required(),
    current_region: yup.string().required(),
  })
  .required()
  .noUnknown();

export const SaveLastPathRules = yup
  .object<ISaveLastPathRequest>({
    lastClientAsPath: yup.string().required("last-client-as-path is required"),
    lastClientPathname: yup.string().required("last-client-pathname is required"),
  })
  .required()
  .noUnknown();

export const PriceListEntryRules = yup
  .object({
    id: yup.number(),
    item_id: yup.number().required(),
    quantity_modifier: yup.number().required(),
  })
  .required()
  .noUnknown();

export const PricelistRules = yup
  .object({
    name: yup.string().required(),
    slug: SlugRule,
  })
  .required()
  .noUnknown();

export const PricelistRequestBodyRules = yup
  .object({
    entries: yup.array(PriceListEntryRules).required(),
    pricelist: PricelistRules.required(),
  })
  .required()
  .noUnknown();

export const ProfessionPricelistRequestBodyRules = yup
  .object({
    entries: yup.array(PriceListEntryRules).required(),
    expansion_name: yup.string().required(),
    pricelist: PricelistRules.required(),
    profession_id: yup.number().required(),
  })
  .required()
  .noUnknown();

export const UserRequestBodyRules = yup
  .object<ICreateUserRequest>({
    email: yup.string().email("email must be a valid email").required("email is required"),
    password: yup
      .string()
      .min(6, "password must be at least 6 characters")
      .required("password is required"),
  })
  .required()
  .noUnknown();

export const PostRequestBodyRules = yup
  .object<ICreatePostRequest>({
    body: yup.string().required("body is required"),
    slug: SlugRule,
    summary: yup.string().required("summary is required"),
    title: yup.string().required("post title is required"),
  })
  .required()
  .noUnknown();

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function FullPostRequestBodyRules(repo: PostRepository, exceptSlug?: string) {
  return yup
    .object<ICreatePostRequest>({
      body: yup.string().required("body is required"),
      slug: SlugRule.test("is-unique", "post must be unique", v => {
        if (!v) {
          return false;
        }

        return repo.hasNoSlug(v, exceptSlug);
      }),
      summary: yup.string().required("summary is required"),
      title: yup.string().required("post title is required"),
    })
    .required()
    .noUnknown();
}

export const AuctionsQueryParamsRules = yup
  .object<IGetAuctionsRequest>({
    count: yup.number().integer("count must be an integer").required("count is required"),
    itemFilters: yup.array(yup.number().required().integer("item-id must be an integer")),
    locale: LocaleRule,
    page: yup.number().integer("page must be an integer").required("page is required"),
    petFilters: yup.array(yup.number().required().integer("pet-id must be an integer")),
    sortDirection: yup
      .number()
      .integer("sort-direction must be an integer")
      .required("sort-direction is required"),
    sortKind: yup
      .number()
      .integer("sort-kind must be an integer")
      .required("sort-kind is required"),
  })
  .required()
  .noUnknown();

export const QueryParamRules = yup
  .object<IQueryRequest>({
    locale: LocaleRule,
    query: yup.string(),
  })
  .required()
  .noUnknown();

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function QueryWorkOrdersParamsRules(mess: RegionsMessenger) {
  return yup
    .object<IFindByOptions>()
    .shape({
      gameVersion: GameVersionRule(mess),
      locale: LocaleRule,
      orderBy: OrderKindRule,
      orderDirection: OrderDirectionRule,
      page: yup.number().required().positive(),
      perPage: PerPageRule,
    })
    .noUnknown();
}

export const CreateWorkOrderRequestRules = yup
  .object<ICreateWorkOrderRequest>({
    itemId: yup.number().positive().required(),
    price: yup.number().integer().required().positive(),
    quantity: yup.number().integer().positive().required(),
  })
  .required()
  .noUnknown();

export async function validate<T>(
  schema: yup.Schema<T>,
  payload: unknown,
): Promise<ValidateResult<T>> {
  try {
    return {
      body: await schema.validate(payload),
      errors: null,
    };
  } catch (err) {
    if (!(err instanceof yup.ValidationError)) {
      throw new Error("error was not yup error");
    }

    return {
      body: null,
      errors: [{ path: [err.path], message: err.message }],
    };
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function Validator<T extends object, A>(schema: yup.ObjectSchema<T>) {
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
