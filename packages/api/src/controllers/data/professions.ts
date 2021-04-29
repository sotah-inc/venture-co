import {
  GetItemsRecipesResponse,
  GetRecipePriceHistoriesResponse,
  IShortSkillTier,
  IShortSkillTierCategory,
  IValidationErrorResponse,
  Locale,
  ProfessionId,
  ProfessionsResponse,
  QueryRecipesResponse,
  RealmSlug,
  RecipeId,
  RecipeResponse,
  RegionName,
  SkillTierId,
  SkillTierResponse,
} from "@sotah-inc/core";
import { IMessengers } from "@sotah-inc/server";
import { code } from "@sotah-inc/server/build/dist/messenger/contracts";
import HTTPStatus from "http-status";
import { ParsedQs } from "qs";

import { ItemsRecipesQuery } from "../../lib/next-validator-rules";
import { QueryParamRules, validate, yupValidationErrorToResponse } from "../../lib/validator-rules";
import { IRequestResult } from "../index";

export class ProfessionsController {
  private messengers: IMessengers;

  constructor(messengers: IMessengers) {
    this.messengers = messengers;
  }

  public async getRecipePriceHistories(
    regionName: RegionName,
    realmSlug: RealmSlug,
    recipeId: RecipeId,
    locale: string,
  ): Promise<IRequestResult<GetRecipePriceHistoriesResponse>> {
    if (!Object.values(Locale).includes(locale as Locale)) {
      const validationErrors: IValidationErrorResponse = {
        error: "could not validate locale",
      };

      return {
        data: validationErrors,
        status: HTTPStatus.BAD_REQUEST,
      };
    }

    // resolving connected-realm
    const resolveMessage = await this.messengers.regions.resolveConnectedRealm({
      realm_slug: realmSlug,
      region_name: regionName,
    });
    switch (resolveMessage.code) {
    case code.ok:
      break;
    case code.notFound: {
      const notFoundValidationErrors: IValidationErrorResponse = {
        error: "could not resolve connected-realm",
      };

      return {
        data: notFoundValidationErrors,
        status: HTTPStatus.NOT_FOUND,
      };
    }
    default: {
      const defaultValidationErrors: IValidationErrorResponse = {
        error: "could not resolve connected-realm",
      };

      return {
        data: defaultValidationErrors,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }
    }

    const resolveResult = await resolveMessage.decode();
    if (resolveResult === null) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const recipeMessage = await this.messengers.professions.getRecipe(recipeId, locale as Locale);
    if (recipeMessage.code !== code.ok) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const recipeResult = await recipeMessage.decode();
    if (recipeResult === null) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const currentUnixTimestamp = Math.floor(Date.now() / 1000);
    const lowerBounds = currentUnixTimestamp - 60 * 60 * 24 * 14;
    const historyMessage = await this.messengers.general.getRecipePricesHistory({
      lower_bounds: lowerBounds,
      recipe_ids: [recipeId],
      tuple: {
        connected_realm_id: resolveResult.connected_realm.connected_realm.id,
        region_name: regionName,
      },
      upper_bounds: currentUnixTimestamp,
    });
    if (historyMessage.code !== code.ok) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }
    const historyMessageResult = await historyMessage.decode();
    if (!historyMessageResult) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }
    const foundHistory = historyMessageResult.history;

    const itemPricesHistoryMessage = await this.messengers.general.resolveItemPricesHistory({
      item_ids: recipeResult.recipe.reagents.map(v => v.reagent.id),
      lower_bounds: lowerBounds,
      tuple: {
        connected_realm_id: resolveResult.connected_realm.connected_realm.id,
        region_name: regionName,
      },
      upper_bounds: currentUnixTimestamp,
    });
    if (itemPricesHistoryMessage.code !== code.ok) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }
    if (itemPricesHistoryMessage.data === null) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    return {
      data: {
        itemData: {
          history: itemPricesHistoryMessage.data.history,
        },
        recipeData: {
          history: foundHistory,
          recipeItemIds: {
            [recipeId]: [
              recipeResult.recipe.alliance_crafted_item.id,
              recipeResult.recipe.horde_crafted_item.id,
              recipeResult.recipe.crafted_item.id,
            ].filter(v => v !== 0),
          },
        },
      },
      status: HTTPStatus.OK,
    };
  }

  public async getProfessions(locale: string): Promise<IRequestResult<ProfessionsResponse>> {
    if (!Object.values(Locale).includes(locale as Locale)) {
      const validationErrors: IValidationErrorResponse = {
        error: "could not validate locale",
      };

      return {
        data: validationErrors,
        status: HTTPStatus.BAD_REQUEST,
      };
    }

    const professionsMsg = await this.messengers.professions.getProfessions(locale as Locale);
    if (professionsMsg.code !== code.ok) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const professionsResult = await professionsMsg.decode();
    if (professionsResult === null) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    return {
      data: { professions: professionsResult.professions },
      status: HTTPStatus.OK,
    };
  }

  public async getSkillTier(
    professionId: ProfessionId,
    skillTierId: SkillTierId,
    locale: string,
  ): Promise<IRequestResult<SkillTierResponse>> {
    if (!Object.values(Locale).includes(locale as Locale)) {
      const validationErrors: IValidationErrorResponse = {
        error: "could not validate locale",
      };

      return {
        data: validationErrors,
        status: HTTPStatus.BAD_REQUEST,
      };
    }

    const skillTierMsg = await this.messengers.professions.getSkillTier(
      professionId,
      skillTierId,
      locale as Locale,
    );
    if (skillTierMsg.code !== code.ok) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const skillTierResult = await skillTierMsg.decode();
    if (skillTierResult === null) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const skillTier = ((): IShortSkillTier => {
      return {
        ...skillTierResult.skilltier,
        categories: skillTierResult.skilltier.categories.map<IShortSkillTierCategory>(category => {
          return {
            ...category,
            recipes: category.recipes.sort((a, b) => {
              if (a.recipe.name !== b.recipe.name) {
                return a.recipe.name.localeCompare(b.recipe.name);
              }

              if (a.recipe.rank === 0 || b.recipe.rank === 0) {
                return a.recipe.id > b.recipe.id ? 1 : -1;
              }

              return a.recipe.rank > b.recipe.rank ? 1 : -1;
            }),
          };
        }),
      };
    })();

    return {
      data: { skillTier },
      status: HTTPStatus.OK,
    };
  }

  public async getRecipe(
    recipeId: RecipeId,
    locale: string,
  ): Promise<IRequestResult<RecipeResponse>> {
    if (!Object.values(Locale).includes(locale as Locale)) {
      const validationErrors: IValidationErrorResponse = {
        error: "could not validate locale",
      };

      return {
        data: validationErrors,
        status: HTTPStatus.BAD_REQUEST,
      };
    }

    const resolveRecipeResult = await this.messengers.professions.resolveRecipe(
      recipeId,
      locale as Locale,
    );
    if (resolveRecipeResult.code !== code.ok || resolveRecipeResult.data === null) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    return {
      data: {
        items: resolveRecipeResult.data.items.items,
        recipe: resolveRecipeResult.data.recipe.recipe,
      },
      status: HTTPStatus.OK,
    };
  }

  public async queryRecipes(query: ParsedQs): Promise<IRequestResult<QueryRecipesResponse>> {
    // parsing request params
    const validateParamsResult = await validate(QueryParamRules, query);
    if (validateParamsResult.error || !validateParamsResult.data) {
      return {
        data: yupValidationErrorToResponse(validateParamsResult.error),
        status: HTTPStatus.BAD_REQUEST,
      };
    }

    // resolving items-query message
    const results = await this.messengers.professions.resolveQueryRecipes({
      locale: validateParamsResult.data.locale as Locale,
      query: validateParamsResult.data.query ?? "",
    });
    if (results.code !== code.ok || results.data === null) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    return {
      data: results.data,
      status: HTTPStatus.OK,
    };
  }

  public async getItemsRecipes(query: ParsedQs): Promise<IRequestResult<GetItemsRecipesResponse>> {
    // parsing query
    const result = ItemsRecipesQuery.safeParse(query);
    if (!result.success) {
      return {
        status: HTTPStatus.BAD_REQUEST,
        data: null,
      };
    }

    // validating locale
    if (!Object.values(Locale).includes(result.data.locale as Locale)) {
      const validationErrors: IValidationErrorResponse = {
        error: "could not validate locale",
      };

      return {
        data: validationErrors,
        status: HTTPStatus.BAD_REQUEST,
      };
    }
    const locale = result.data.locale as Locale;

    // resolving items-recipe-ids
    const itemRecipeIdsResult = await this.messengers.professions.resolveAllItemRecipes(
      result.data.itemIds.map(Number),
    );
    if (itemRecipeIdsResult.code !== code.ok || itemRecipeIdsResult.data === null) {
      return {
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }

    // resolving recipes
    const recipeIds = ((): RecipeId[] => {
      const recipeIdSet = new Set<RecipeId>();
      for (const resolveItem of itemRecipeIdsResult.data.itemRecipes) {
        for (const itemIdString of Object.keys(resolveItem.response)) {
          const foundRecipeIds = resolveItem.response[Number(itemIdString)];
          if (foundRecipeIds === null || foundRecipeIds === undefined) {
            continue;
          }

          for (const recipeId of foundRecipeIds) {
            recipeIdSet.add(recipeId);
          }
        }
      }

      return Array.from(recipeIdSet);
    })();
    if (recipeIds.length === 0) {
      return {
        data: {
          itemsRecipes: [],
          skillTiers: [],
          professions: [],
          recipes: [],
        },
        status: HTTPStatus.OK,
      };
    }

    const resolveRecipesResult = await this.messengers.professions.resolveRecipes(
      recipeIds,
      locale,
    );
    if (resolveRecipesResult.code !== code.ok || resolveRecipesResult.data === null) {
      return {
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }

    return {
      data: {
        ...resolveRecipesResult.data,
        itemsRecipes: itemRecipeIdsResult.data.itemRecipes.map(v => {
          return {
            kind: v.kind,
            ids: v.response,
          };
        }),
      },
      status: HTTPStatus.OK,
    };
  }
}
