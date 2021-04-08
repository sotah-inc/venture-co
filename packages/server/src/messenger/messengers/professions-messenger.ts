import {
  IProfessionSkillTierTuple,
  ItemId,
  Locale,
  ProfessionId,
  RecipeId,
  SkillTierId,
} from "@sotah-inc/core";
import * as nats from "nats";

import { code, IQueryItemsRequest } from "../contracts";
import {
  IItemsRecipesResponse,
  IProfessionsResponse,
  IQueryRecipesResponse,
  IRecipeResponse,
  IRecipesResponse,
  ISkillTierResponse,
  ISkillTiersResponse,
  ResolveQueryRecipesResponse,
  ResolveRecipeResponse,
  ResolveRecipesResponse,
} from "../contracts/professions";
import { Message, ParseKind } from "../message";
import { BaseMessenger } from "./base";
import { ItemsMessenger } from "./items-messenger";

enum subjects {
  professions = "professions",
  professionsFromIds = "professionsFromIds",
  skillTier = "skillTier",
  skillTiers = "skillTiers",
  recipe = "recipe",
  recipes = "recipes",
  recipesQuery = "recipesQuery",
  itemsRecipes = "itemsRecipes",
}

export class ProfessionsMessenger extends BaseMessenger {
  private itemsMessenger: ItemsMessenger;

  constructor(client: nats.Client, itemsMessenger: ItemsMessenger) {
    super(client);

    this.itemsMessenger = itemsMessenger;
  }

  public async getProfessions(locale: Locale): Promise<Message<IProfessionsResponse>> {
    return this.request(subjects.professions, {
      body: JSON.stringify({ locale }),
      parseKind: ParseKind.GzipJsonEncoded,
    });
  }

  public async getProfessionsFromIds(
    ids: ProfessionId[],
    locale: Locale,
  ): Promise<Message<IProfessionsResponse>> {
    return this.request(subjects.professionsFromIds, {
      body: JSON.stringify({ locale, profession_ids: ids }),
      parseKind: ParseKind.GzipJsonEncoded,
    });
  }

  public async getSkillTier(
    professionId: ProfessionId,
    skillTierId: SkillTierId,
    locale: Locale,
  ): Promise<Message<ISkillTierResponse>> {
    return this.request(subjects.skillTier, {
      body: JSON.stringify({ profession_id: professionId, skilltier_id: skillTierId, locale }),
      parseKind: ParseKind.GzipJsonEncoded,
    });
  }

  public async getSkillTiers(
    tuples: IProfessionSkillTierTuple[],
    locale: Locale,
  ): Promise<Message<ISkillTiersResponse>> {
    return this.request(subjects.skillTiers, {
      body: JSON.stringify({ tuples, locale }),
      parseKind: ParseKind.GzipJsonEncoded,
    });
  }

  public async getRecipe(recipeId: RecipeId, locale: Locale): Promise<Message<IRecipeResponse>> {
    return this.request(subjects.recipe, {
      body: JSON.stringify({ recipe_id: recipeId, locale }),
      parseKind: ParseKind.GzipJsonEncoded,
    });
  }

  public async getRecipes(
    recipeIds: RecipeId[],
    locale: Locale,
  ): Promise<Message<IRecipesResponse>> {
    return this.request(subjects.recipes, {
      body: JSON.stringify({ recipe_ids: recipeIds, locale }),
      parseKind: ParseKind.GzipJsonEncoded,
    });
  }

  public async resolveRecipe(recipeId: RecipeId, locale: Locale): Promise<ResolveRecipeResponse> {
    const recipeMsg = await this.getRecipe(recipeId, locale);
    if (recipeMsg.code !== code.ok) {
      return {
        code: recipeMsg.code,
        data: null,
        error: recipeMsg.error?.message ?? null,
      };
    }

    const recipeResult = await recipeMsg.decode();
    if (recipeResult === null) {
      return {
        code: code.msgJsonParseError,
        data: null,
        error: "failed to decode recipe message",
      };
    }

    const itemIds = ((): ItemId[] => {
      const out = new Set<ItemId>();
      if (recipeResult.recipe.crafted_item.id > 0) {
        out.add(recipeResult.recipe.crafted_item.id);
      }
      if (recipeResult.recipe.alliance_crafted_item.id > 0) {
        out.add(recipeResult.recipe.alliance_crafted_item.id);
      }
      if (recipeResult.recipe.horde_crafted_item.id > 0) {
        out.add(recipeResult.recipe.horde_crafted_item.id);
      }
      if (recipeResult.recipe.supplemental_crafted_item_id > 0) {
        out.add(recipeResult.recipe.supplemental_crafted_item_id);
      }

      recipeResult.recipe.reagents.forEach(v => out.add(v.reagent.id));

      return Array.from(out);
    })();
    const itemsMsg = await this.itemsMessenger.getItems({
      itemIds,
      locale,
    });
    if (itemsMsg.code !== code.ok) {
      return {
        code: itemsMsg.code,
        data: null,
        error: itemsMsg.error?.message ?? null,
      };
    }

    const itemsResult = await itemsMsg.decode();
    if (itemsResult === null) {
      return {
        code: code.msgJsonParseError,
        data: null,
        error: "failed to decode items-message",
      };
    }

    return {
      code: code.ok,
      data: { recipe: recipeResult, items: itemsResult },
      error: null,
    };
  }

  public queryRecipes(request: IQueryItemsRequest): Promise<Message<IQueryRecipesResponse>> {
    return this.request(subjects.recipesQuery, { body: JSON.stringify(request) });
  }

  public async resolveQueryRecipes(
    request: IQueryItemsRequest,
  ): Promise<ResolveQueryRecipesResponse> {
    // resolving items-query message
    const itemsQueryMessage = await this.queryRecipes(request);
    if (itemsQueryMessage.code !== code.ok) {
      return {
        data: null,
        code: itemsQueryMessage.code,
        error: null,
      };
    }

    const itemsQueryResult = await itemsQueryMessage.decode();
    if (itemsQueryResult === null) {
      return {
        data: null,
        code: code.msgJsonParseError,
        error: null,
      };
    }

    const resolveRecipesResult = await this.resolveRecipes(
      itemsQueryResult.items.map(v => v.recipe_id),
      request.locale,
    );
    if (resolveRecipesResult.code !== code.ok) {
      return {
        data: null,
        code: resolveRecipesResult.code,
        error: null,
      };
    }
    if (resolveRecipesResult.data === null) {
      return {
        data: null,
        code: code.genericError,
        error: null,
      };
    }

    return {
      code: code.ok,
      data: {
        queryResponse: itemsQueryResult,
        ...resolveRecipesResult.data,
      },
      error: null,
    };
  }

  public async getItemsRecipes(req: {
    item_ids: ItemId[];
  }): Promise<Message<IItemsRecipesResponse>> {
    return this.request(subjects.itemsRecipes, {
      body: JSON.stringify(req),
      parseKind: ParseKind.GzipJsonEncoded,
    });
  }

  public async resolveRecipes(ids: RecipeId[], locale: Locale): Promise<ResolveRecipesResponse> {
    // resolving recipes from recipe-ids
    const getRecipesMessage = await this.getRecipes(ids, locale);
    if (getRecipesMessage.code !== code.ok) {
      return {
        data: null,
        code: getRecipesMessage.code,
        error: null,
      };
    }

    const getRecipesResult = await getRecipesMessage.decode();
    if (getRecipesResult === null) {
      return {
        data: null,
        code: code.msgJsonParseError,
        error: null,
      };
    }

    const professionIds = Array.from<ProfessionId>(
      new Set<ProfessionId>(getRecipesResult.recipes.map(v => v.profession_id)),
    );
    const getProfessionsFromIdsMessage = await this.getProfessionsFromIds(professionIds, locale);
    if (getProfessionsFromIdsMessage.code !== code.ok) {
      return {
        data: null,
        code: getProfessionsFromIdsMessage.code,
        error: null,
      };
    }

    const getProfessionsFromIdsResult = await getProfessionsFromIdsMessage.decode();
    if (getProfessionsFromIdsResult === null) {
      return {
        data: null,
        code: code.msgJsonParseError,
        error: null,
      };
    }

    const professionSkillTiers = getRecipesResult.recipes.reduce<{
      [professionId: number]: Set<SkillTierId> | undefined;
    }>((groupResult, recipe) => {
      const skillTiers: Set<SkillTierId> =
        groupResult[recipe.profession_id] ?? new Set<SkillTierId>();
      skillTiers.add(recipe.skilltier_id);

      return {
        ...groupResult,
        [recipe.profession_id]: skillTiers,
      };
    }, {});
    const professionSkillTierTuples = Object.keys(professionSkillTiers).reduce<
      IProfessionSkillTierTuple[]
    >((tuples, professionIdString) => {
      const skillTiers = professionSkillTiers[Number(professionIdString)];
      const skillTiersTuples = Array.from(
        skillTiers ?? new Set<SkillTierId>(),
      ).map<IProfessionSkillTierTuple>(skillTierId => {
        return {
          profession_id: Number(professionIdString),
          skilltier_id: skillTierId,
        };
      });

      return [...tuples, ...skillTiersTuples];
    }, []);
    const getSkillTiersMessage = await this.getSkillTiers(professionSkillTierTuples, locale);
    if (getSkillTiersMessage.code !== code.ok) {
      return {
        data: null,
        code: getSkillTiersMessage.code,
        error: null,
      };
    }

    const getSkillTiersResult = await getSkillTiersMessage.decode();
    if (getSkillTiersResult === null) {
      return {
        data: null,
        code: code.msgJsonParseError,
        error: null,
      };
    }

    return {
      code: code.ok,
      data: {
        recipes: getRecipesResult.recipes,
        professions: getProfessionsFromIdsResult.professions,
        skillTiers: getSkillTiersResult.skilltiers,
      },
      error: null,
    };
  }
}
