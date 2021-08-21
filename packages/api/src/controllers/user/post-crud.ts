import {
  CreatePostResponse,
  DeletePostResponse,
  UpdatePostRequest,
  UpdatePostResponse,
  UserLevel,
} from "@sotah-inc/core";
import { Post, PostRepository } from "@sotah-inc/server";
import { Response } from "express";
import * as HTTPStatus from "http-status";
import { Connection } from "typeorm";

import { Authenticator, IRequest, IRequestResult, PlainRequest, StringMap } from "../index";
import { resolveUser, resolveWriteablePost } from "../resolvers";
import { validate, validationErrorsToResponse } from "../validators";
import { FullPostRequestBodyRules } from "../validators/yup";

export class PostCrudController {
  private dbConn: Connection;

  constructor(dbConn: Connection) {
    this.dbConn = dbConn;
  }

  @Authenticator(UserLevel.Admin)
  public async createPost(
    req: PlainRequest,
    _res: Response,
  ): Promise<IRequestResult<CreatePostResponse>> {
    const resolveUserResult = resolveUser(req.sotahUser);
    if (resolveUserResult.errorResponse !== null) {
      return resolveUserResult.errorResponse;
    }

    const validateBodyResult = await validate(
      FullPostRequestBodyRules(this.dbConn.getCustomRepository(PostRepository)),
      req.body,
    );
    if (validateBodyResult.errors !== null) {
      return {
        data: validationErrorsToResponse(validateBodyResult.errors),
        status: HTTPStatus.BAD_REQUEST,
      };
    }

    const post = new Post();
    post.title = validateBodyResult.body.title;
    post.slug = validateBodyResult.body.slug;
    post.user = resolveUserResult.data.user;
    post.body = validateBodyResult.body.body;
    post.summary = validateBodyResult.body.summary;
    await this.dbConn.manager.save(post);

    return {
      data: { post: post.toJson() },
      status: HTTPStatus.CREATED,
    };
  }

  @Authenticator(UserLevel.Admin)
  public async updatePost(
    req: IRequest<UpdatePostRequest, StringMap>,
    _res: Response,
  ): Promise<IRequestResult<UpdatePostResponse>> {
    const resolveWriteablePostResult = await resolveWriteablePost(
      this.dbConn,
      req.params,
      req.sotahUser,
    );
    if (resolveWriteablePostResult.errorResponse !== null) {
      return resolveWriteablePostResult.errorResponse;
    }

    const validateBodyResult = await validate(
      FullPostRequestBodyRules(
        this.dbConn.getCustomRepository(PostRepository),
        resolveWriteablePostResult.data.slug,
      ),
      req.body,
    );
    if (validateBodyResult.errors !== null) {
      return {
        data: validationErrorsToResponse(validateBodyResult.errors),
        status: HTTPStatus.BAD_REQUEST,
      };
    }

    const post = resolveWriteablePostResult.data;
    post.title = validateBodyResult.body.title;
    post.slug = validateBodyResult.body.slug;
    post.body = validateBodyResult.body.body;
    post.summary = validateBodyResult.body.summary;
    await this.dbConn.manager.save(post);

    return {
      data: { post: post.toJson() },
      status: HTTPStatus.OK,
    };
  }

  @Authenticator(UserLevel.Admin)
  public async deletePost(
    req: PlainRequest,
    _res: Response,
  ): Promise<IRequestResult<DeletePostResponse>> {
    const resolveWriteablePostResult = await resolveWriteablePost(
      this.dbConn,
      req.params,
      req.sotahUser,
    );
    if (resolveWriteablePostResult.errorResponse !== null) {
      return resolveWriteablePostResult.errorResponse;
    }

    await this.dbConn.manager.remove(resolveWriteablePostResult.data);

    return {
      data: null,
      status: HTTPStatus.OK,
    };
  }
}
