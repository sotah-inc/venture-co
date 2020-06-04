import {
  GameVersion,
  ICreatePostRequest,
  ICreatePreferencesRequest,
  ICreateWorkOrderRequest,
  IGetAuctionsRequest,
  IUpdateProfileRequest,
  OrderDirection,
  OrderKind,
  SortPerPage,
} from "@sotah-inc/core";
import { IFindByOptions, PostRepository, UserRepository } from "@sotah-inc/server";
import * as yup from "yup";

export const PreferenceRules = yup
  .object<ICreatePreferencesRequest>()
  .shape({
    current_realm: yup.string(),
    current_region: yup.string(),
  })
  .noUnknown();

export const PriceListEntryRules = yup
  .object()
  .shape({
    id: yup.number(),
    item_id: yup.number().required(),
    quantity_modifier: yup.number().required(),
  })
  .noUnknown();

export const PricelistRules = yup
  .object()
  .shape({
    name: yup.string().required(),
    slug: yup
      .string()
      .min(4)
      .matches(/^[a-z|0-9|_|\-]+$/)
      .required(),
  })
  .noUnknown();

export const PricelistRequestBodyRules = yup
  .object()
  .shape({
    entries: yup.array(PriceListEntryRules).required(),
    pricelist: PricelistRules.required(),
  })
  .noUnknown();

export const ProfessionPricelistRequestBodyRules = yup
  .object()
  .shape({
    entries: yup.array(PriceListEntryRules).required(),
    expansion_name: yup.string().required(),
    pricelist: PricelistRules.required(),
    profession_name: yup.string().required(),
  })
  .noUnknown();

export const UserRequestBodyRules = yup
  .object()
  .shape({
    email: yup.string().email("Email must be a valid email").required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  })
  .noUnknown();

export const PostRequestBodyRules = yup
  .object<ICreatePostRequest>()
  .shape({
    body: yup.string().required("Body is required"),
    slug: yup
      .string()
      .min(4, "Post slug must be 4 characters")
      .matches(/^[a-z|0-9|_|\-]+$/, "Post slug must be a-z, 0-9, or underscore")
      .required("Post slug is requred"),
    summary: yup.string().required("Summary is required"),
    title: yup.string().required("Post title is requred"),
  })
  .noUnknown();

export const FullPostRequestBodyRules = (repo: PostRepository, exceptSlug?: string) =>
  yup
    .object<ICreatePostRequest>()
    .shape({
      body: yup.string().required("Body is required"),
      slug: yup
        .string()
        .min(4, "Post slug must be 4 characters")
        .matches(/^[a-z|0-9|_|\-]+$/, "Post slug must be a-z, 0-9, or underscore")
        .required("Post slug is requred")
        .test("is-unique", "Post must be unique", v => repo.hasNoSlug(v, exceptSlug)),
      summary: yup.string().required("Summary is required"),
      title: yup.string().required("Post title is requred"),
    })
    .noUnknown();

export const UpdateProfileRequestBodyRules = (repo: UserRepository, exceptEmail?: string) =>
  yup
    .object<IUpdateProfileRequest>()
    .shape({
      email: yup
        .string()
        .email("Email must be a valid email")
        .required("Email is required")
        .test("is-unique", "Email must not already be taken", v => repo.hasNoEmail(v, exceptEmail)),
    })
    .noUnknown();

export const AuctionsQueryParamsRules = yup
  .object<IGetAuctionsRequest>()
  .shape({
    count: yup.number().integer("Count must be an integer").required("Count is required"),
    itemFilters: yup.array(yup.number().integer("Item-id must be an integer")),
    page: yup.number().integer("Page must be an integer").required("Page is required"),
    sortDirection: yup
      .number()
      .integer("Sort-direction must be an integer")
      .required("Sort-direction is required"),
    sortKind: yup
      .number()
      .integer("Sort-kind must be an integer")
      .required("Sort-kind is required"),
  })
  .noUnknown();

export const QueryWorkOrdersParamsRules = yup
  .object<IFindByOptions>()
  .shape({
    gameVersion: yup.string().required().oneOf(Object.values(GameVersion)),
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
  .object<ICreateWorkOrderRequest>()
  .shape<ICreateWorkOrderRequest>({
    itemId: yup.number().positive().required(),
    price: yup.number().integer().required().positive(),
    quantity: yup.number().integer().positive().required(),
  })
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
