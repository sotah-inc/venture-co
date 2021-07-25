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
import * as yup from "yup";

import {
  GameVersionRule,
  LocaleRule,
  OrderDirectionRule,
  OrderKindRule,
  PerPageRule,
  SlugRule,
} from "./validator-rules/params";

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
