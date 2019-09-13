import {
  ICreatePostRequest,
  ICreatePostResponse,
  IUpdatePostRequest,
  IUpdatePostResponse,
  IValidationErrorResponse,
  UserLevel,
} from "@sotah-inc/core";
import { Post, PostRepository, User } from "@sotah-inc/server";
import { Response } from "express";
import * as HTTPStatus from "http-status";
import { Connection } from "typeorm";

import { FullPostRequestBodyRules, PostRequestBodyRules } from "../../lib/validator-rules";
import { Authenticator, IRequest, IRequestResult, ManualValidator, Validator } from "../index";

export class PostCrudController {
  private dbConn: Connection;

  constructor(dbConn: Connection) {
    this.dbConn = dbConn;
  }

  @Authenticator<ICreatePostRequest, ICreatePostResponse>(UserLevel.Admin)
  @Validator<ICreatePostRequest, ICreatePostResponse>(PostRequestBodyRules)
  public async createPost(
    req: IRequest<ICreatePostRequest>,
    _res: Response,
  ): Promise<IRequestResult<ICreatePostResponse | IValidationErrorResponse>> {
    const result = await ManualValidator<ICreatePostRequest>(
      req,
      FullPostRequestBodyRules(this.dbConn.getCustomRepository(PostRepository)),
    );
    if (typeof result.errorResult !== "undefined") {
      return result.errorResult;
    }
    const { body } = result.req!;

    const post = new Post();
    post.title = body.title;
    post.slug = body.slug;
    post.user = req.user as User;
    post.body = body.body;
    post.summary = body.summary;
    await this.dbConn.manager.save(post);

    return {
      data: { post: post.toJson() },
      status: HTTPStatus.CREATED,
    };
  }

  @Authenticator<IUpdatePostRequest, IUpdatePostResponse>(UserLevel.Admin)
  @Validator<IUpdatePostRequest, IUpdatePostResponse>(PostRequestBodyRules)
  public async updatePost(
    req: IRequest<IUpdatePostRequest>,
    _res: Response,
  ): Promise<IRequestResult<IUpdatePostResponse | IValidationErrorResponse>> {
    const post = await this.dbConn
      .getCustomRepository(PostRepository)
      .getWithUser(Number(req.params["post_id"]));
    if (post === null) {
      const validationResponse: IValidationErrorResponse = {
        notFound: "Not Found",
      };

      return {
        data: validationResponse,
        status: HTTPStatus.NOT_FOUND,
      };
    }

    const user = req.user as User;
    if (post.user!.id !== user.id) {
      const validationResponse: IValidationErrorResponse = {
        unauthorized: "Unauthorized",
      };

      return {
        data: validationResponse,
        status: HTTPStatus.UNAUTHORIZED,
      };
    }

    const result = await ManualValidator<IUpdatePostRequest>(
      req,
      FullPostRequestBodyRules(this.dbConn.getCustomRepository(PostRepository), post.slug),
    );
    if (typeof result.errorResult !== "undefined") {
      return result.errorResult;
    }
    const { body } = result.req!;

    post.title = body.title;
    post.slug = body.slug;
    post.body = body.body;
    post.summary = body.summary;
    await this.dbConn.manager.save(post);

    return {
      data: { post: post.toJson() },
      status: HTTPStatus.OK,
    };
  }

  @Authenticator<null, null>(UserLevel.Admin)
  public async deletePost(
    req: IRequest<null>,
    _res: Response,
  ): Promise<IRequestResult<null | IValidationErrorResponse>> {
    const user = req.user as User;
    const post = await this.dbConn
      .getCustomRepository(PostRepository)
      .getWithUser(Number(req.params["post_id"]));
    if (post === null) {
      const validationResponse: IValidationErrorResponse = {
        notFound: "Not Found",
      };

      return {
        data: validationResponse,
        status: HTTPStatus.NOT_FOUND,
      };
    }

    if (post.user!.id !== user.id) {
      const validationResponse: IValidationErrorResponse = {
        unauthorized: "Unauthorized",
      };

      return {
        data: validationResponse,
        status: HTTPStatus.UNAUTHORIZED,
      };
    }

    await this.dbConn.manager.remove(post);

    return {
      data: null,
      status: HTTPStatus.OK,
    };
  }
}
