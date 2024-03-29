import {
  GetItemsRecipesResponse,
  GetRecipePriceHistoriesResponse,
  IShortSkillTier,
  IShortSkillTierCategory,
  ItemsVendorPricesResponse,
  ProfessionsResponse,
  QueryRecipesResponse,
  RecipeResponse,
  SkillTierResponse,
} from "@sotah-inc/core";
import { IMessengers } from "@sotah-inc/server";
import { code } from "@sotah-inc/server/build/dist/messenger/contracts";
import { Response } from "express";
import HTTPStatus from "http-status";

import { IRequestResult, PlainRequest } from "../index";
import { resolveRealmSlug } from "../resolvers";
import { validate, validationErrorsToResponse } from "../validators";
import {
  createSchema,
  GameVersionRule,
  LocaleRule,
  ProfessionIdRule,
  QueryParamRules,
  RecipeIdRule,
  SkillTierIdRule,
} from "../validators/yup";
import { ItemsRecipesQuery, ItemsVendorPricesQuery } from "../validators/zod";

export class ProfessionsController {
  private messengers: IMessengers;

  constructor(messengers: IMessengers) {
    this.messengers = messengers;
  }

  public async getRecipePriceHistories(
    req: PlainRequest,
    _res: Response,
  ): Promise<IRequestResult<GetRecipePriceHistoriesResponse>> {
    const resolveRealmSlugResult = await resolveRealmSlug(req.params, this.messengers.regions);
    if (resolveRealmSlugResult.errorResponse !== null) {
      return resolveRealmSlugResult.errorResponse;
    }

    const validateQueryResult = await validate(createSchema({ locale: LocaleRule }), req.query);
    if (validateQueryResult.errors !== null) {
      return {
        status: HTTPStatus.BAD_REQUEST,
        data: validationErrorsToResponse(validateQueryResult.errors),
      };
    }

    const validateParamsResult = await validate(
      createSchema({
        recipeId: RecipeIdRule,
      }),
      req.params,
    );
    if (validateParamsResult.errors !== null) {
      return {
        status: HTTPStatus.BAD_REQUEST,
        data: validationErrorsToResponse(validateParamsResult.errors),
      };
    }

    const recipeMessage = await this.messengers.professions.recipe(
      validateParamsResult.body.recipeId,
      validateQueryResult.body.locale,
    );
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
    const historyMessage = await this.messengers.pricelistHistory.recipePricesHistory({
      lower_bounds: lowerBounds,
      recipe_ids: [validateParamsResult.body.recipeId],
      tuple: resolveRealmSlugResult.data.tuple,
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
      tuple: resolveRealmSlugResult.data.tuple,
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
            [validateParamsResult.body.recipeId]: [
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

  public async getProfessions(
    req: PlainRequest,
    _res: Response,
  ): Promise<IRequestResult<ProfessionsResponse>> {
    const validateQueryResult = await validate(createSchema({ locale: LocaleRule }), req.query);
    if (validateQueryResult.errors !== null) {
      return {
        status: HTTPStatus.BAD_REQUEST,
        data: validationErrorsToResponse(validateQueryResult.errors),
      };
    }

    const professionsMsg = await this.messengers.professions.professions(
      validateQueryResult.body.locale,
    );
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
    req: PlainRequest,
    _res: Response,
  ): Promise<IRequestResult<SkillTierResponse>> {
    const validateParamsResult = await validate(
      createSchema({
        professionId: ProfessionIdRule,
        skillTierId: SkillTierIdRule,
      }),
      req.params,
    );
    if (validateParamsResult.errors !== null) {
      return {
        status: HTTPStatus.BAD_REQUEST,
        data: validationErrorsToResponse(validateParamsResult.errors),
      };
    }

    const validateQueryResult = await validate(
      createSchema({
        locale: LocaleRule,
      }),
      req.params,
    );
    if (validateQueryResult.errors !== null) {
      return {
        status: HTTPStatus.BAD_REQUEST,
        data: validationErrorsToResponse(validateQueryResult.errors),
      };
    }

    const skillTierMsg = await this.messengers.professions.skillTier(
      validateParamsResult.body.professionId,
      validateParamsResult.body.skillTierId,
      validateQueryResult.body.locale,
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
    req: PlainRequest,
    _res: Response,
  ): Promise<IRequestResult<RecipeResponse>> {
    const validateParamsResult = await validate(
      createSchema({
        gameVersion: GameVersionRule,
        recipeId: RecipeIdRule,
      }),
      req.params,
    );
    if (validateParamsResult.errors !== null) {
      return {
        status: HTTPStatus.BAD_REQUEST,
        data: validationErrorsToResponse(validateParamsResult.errors),
      };
    }

    const validateQueryResult = await validate(
      createSchema({
        locale: LocaleRule,
      }),
      req.params,
    );
    if (validateQueryResult.errors !== null) {
      return {
        status: HTTPStatus.BAD_REQUEST,
        data: validationErrorsToResponse(validateQueryResult.errors),
      };
    }

    const resolveRecipeResult = await this.messengers.professions.resolveRecipe(
      validateParamsResult.body.gameVersion,
      validateParamsResult.body.recipeId,
      validateQueryResult.body.locale,
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

  public async queryRecipes(
    req: PlainRequest,
    _res: Response,
  ): Promise<IRequestResult<QueryRecipesResponse>> {
    const validateQueryResult = await validate(QueryParamRules, req.query);
    if (validateQueryResult.errors !== null) {
      return {
        status: HTTPStatus.BAD_REQUEST,
        data: validationErrorsToResponse(validateQueryResult.errors),
      };
    }

    const validateParamsResult = await validate(
      createSchema({ gameVersion: GameVersionRule }),
      req.params,
    );
    if (validateParamsResult.errors !== null) {
      return {
        status: HTTPStatus.BAD_REQUEST,
        data: validationErrorsToResponse(validateParamsResult.errors),
      };
    }

    // resolving items-query message
    const results = await this.messengers.professions.resolveQueryRecipes({
      locale: validateQueryResult.body.locale,
      query: validateQueryResult.body.query,
      game_version: validateParamsResult.body.gameVersion,
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

  public async getItemsRecipes(
    req: PlainRequest,
    _res: Response,
  ): Promise<IRequestResult<GetItemsRecipesResponse>> {
    const validateQueryResult = await validate(ItemsRecipesQuery, req.query);
    if (validateQueryResult.errors !== null) {
      return {
        status: HTTPStatus.BAD_REQUEST,
        data: validationErrorsToResponse(validateQueryResult.errors),
      };
    }

    // resolving items-recipe-ids
    const itemRecipeIdsResult = await this.messengers.professions.resolveAllItemRecipes(
      validateQueryResult.body.itemIds.map(Number),
    );
    if (itemRecipeIdsResult.code !== code.ok || itemRecipeIdsResult.data === null) {
      return {
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }

    if (itemRecipeIdsResult.data.recipeIds.length === 0) {
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
      itemRecipeIdsResult.data.recipeIds,
      validateQueryResult.body.locale,
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

  public async vendorPrices(
    req: PlainRequest,
    _res: Response,
  ): Promise<IRequestResult<ItemsVendorPricesResponse>> {
    const validateParamsResult = await validate(
      createSchema({ gameVersion: GameVersionRule }),
      req.params,
    );
    if (validateParamsResult.errors !== null) {
      return {
        status: HTTPStatus.BAD_REQUEST,
        data: validationErrorsToResponse(validateParamsResult.errors),
      };
    }

    const validateQueryResult = await validate(ItemsVendorPricesQuery, req.query);
    if (validateQueryResult.errors !== null) {
      return {
        status: HTTPStatus.BAD_REQUEST,
        data: validationErrorsToResponse(validateQueryResult.errors),
      };
    }

    // gathering item-vendor-prices
    const vendorPricesMessage = await this.messengers.items.itemsVendorPrices({
      item_ids: validateQueryResult.body.itemIds.map(Number),
      game_version: validateParamsResult.body.gameVersion,
    });
    if (vendorPricesMessage.code !== code.ok) {
      return {
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }

    const vendorPricesResult = await vendorPricesMessage.decode();
    if (vendorPricesResult === null) {
      return {
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }

    return {
      data: vendorPricesResult,
      status: HTTPStatus.OK,
    };
  }
}
