import {
  GameVersion,
  ICreatePostRequest,
  ICreatePreferencesRequest,
  ICreateUserRequest,
  ICreateWorkOrderRequest,
  IGetAuctionsRequest,
  IQueryRequest,
  IValidationErrorResponse,
  Locale,
  OrderDirection,
  OrderKind,
  SortPerPage,
} from "@sotah-inc/core";
import { IFindByOptions, PostRepository } from "@sotah-inc/server";
import * as yup from "yup";

export const PreferenceRules = yup
  .object<ICreatePreferencesRequest>({
    current_realm: yup.string().required(),
    current_region: yup.string().required(),
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
    slug: yup
      .string()
      .min(4)
      .matches(/^[a-z0-9_-]+$/)
      .required(),
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
    slug: yup
      .string()
      .min(4, "post slug must be 4 characters")
      .matches(/^[a-z0-9_-]+$/, "post slug must be a-z, 0-9, or underscore")
      .required("post slug is required"),
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
      slug: yup
        .string()
        .min(4, "post slug must be 4 characters")
        .matches(/^[a-z0-9_-]+$/, "post slug must be a-z, 0-9, or underscore")
        .required("post slug is required")
        .test("is-unique", "post must be unique", v => {
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
    locale: yup.string().oneOf(Object.values(Locale)).required("locale is required"),
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
    locale: yup.string().oneOf(Object.values(Locale)).required("locale is required"),
    query: yup.string(),
  })
  .required()
  .noUnknown();

export const QueryWorkOrdersParamsRules = yup
  .object<IFindByOptions>()
  .shape({
    gameVersion: yup.string().required().oneOf(Object.values(GameVersion)),
    locale: yup.string().required().oneOf(Object.values(Locale)),
    orderBy: yup.string().required().oneOf(Object.values(OrderKind)),
    orderDirection: yup.string().required().oneOf(Object.values(OrderDirection)),
    page: yup.number().required().positive(),
    perPage: yup
      .number()
      .required()
      .positive()
      .oneOf(
        Object.values(SortPerPage)
          .filter(v => !isNaN(Number(v)))
          .map(Number),
      ),
  })
  .noUnknown();

export const CreateWorkOrderRequestRules = yup
  .object<ICreateWorkOrderRequest>({
    itemId: yup.number().positive().required(),
    price: yup.number().integer().required().positive(),
    quantity: yup.number().integer().positive().required(),
  })
  .required()
  .noUnknown();

export interface IValidateResult<T> {
  data: T | null;
  error: yup.ValidationError | null;
}

export async function validate<T>(
  schema: yup.Schema<T>,
  payload: unknown,
): Promise<IValidateResult<T>> {
  try {
    return {
      data: await schema.validate(payload),
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: err,
    };
  }
}

export function yupValidationErrorToResponse(
  error: yup.ValidationError | null,
): IValidationErrorResponse {
  return error ? { [error.path]: error.message } : {};
}
