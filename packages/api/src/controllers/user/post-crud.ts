import {
  CreatePostResponse,
  DeletePostResponse,
  ICreatePostRequest,
  IValidationErrorResponse,
  UpdatePostRequest,
  UpdatePostResponse,
  UserLevel,
} from "@sotah-inc/core";
import { Post, PostRepository, User } from "@sotah-inc/server";
import { Response } from "express";
import * as HTTPStatus from "http-status";
import { Connection } from "typeorm";

import {
  FullPostRequestBodyRules,
  PostRequestBodyRules,
  validate,
  yupValidationErrorToResponse,
} from "../../lib/validator-rules";
import { Authenticator, IRequest, IRequestResult, Validator } from "../index";

export class PostCrudController {
  private dbConn: Connection;

  constructor(dbConn: Connection) {
    this.dbConn = dbConn;
  }

  @Authenticator<ICreatePostRequest, CreatePostResponse>(UserLevel.Admin)
  @Validator<ICreatePostRequest, CreatePostResponse>(PostRequestBodyRules)
  public async createPost(
    req: IRequest<ICreatePostRequest>,
    _res: Response,
  ): Promise<IRequestResult<CreatePostResponse>> {
    const result = await validate(
      FullPostRequestBodyRules(this.dbConn.getCustomRepository(PostRepository)),
      req,
    );
    if (result.error || !result.data) {
      return {
        data: yupValidationErrorToResponse(result.error),
        status: HTTPStatus.BAD_REQUEST,
      };
    }

    const post = new Post();
    post.title = result.data.title;
    post.slug = result.data.slug;
    post.user = req.user as User;
    post.body = result.data.body;
    post.summary = result.data.summary;
    await this.dbConn.manager.save(post);

    return {
      data: { post: post.toJson() },
      status: HTTPStatus.CREATED,
    };
  }

  @Authenticator<UpdatePostRequest, UpdatePostResponse>(UserLevel.Admin)
  @Validator<UpdatePostRequest, UpdatePostResponse>(PostRequestBodyRules)
  public async updatePost(
    req: IRequest<UpdatePostRequest>,
    _res: Response,
  ): Promise<IRequestResult<UpdatePostResponse>> {
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

    const result = await validate(
      FullPostRequestBodyRules(this.dbConn.getCustomRepository(PostRepository), post.slug),
      req,
    );
    if (result.error || !result.data) {
      return {
        data: yupValidationErrorToResponse(result.error),
        status: HTTPStatus.BAD_REQUEST,
      };
    }

    post.title = result.data.title;
    post.slug = result.data.slug;
    post.body = result.data.body;
    post.summary = result.data.summary;
    await this.dbConn.manager.save(post);

    return {
      data: { post: post.toJson() },
      status: HTTPStatus.OK,
    };
  }

  @Authenticator<null, DeletePostResponse>(UserLevel.Admin)
  public async deletePost(
    req: IRequest<null>,
    _res: Response,
  ): Promise<IRequestResult<DeletePostResponse>> {
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
