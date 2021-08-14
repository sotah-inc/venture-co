import { GetPostResponse, GetPostsResponse, IValidationErrorResponse } from "@sotah-inc/core";
import { Post } from "@sotah-inc/server";
import { Response } from "express";
import HTTPStatus from "http-status";
import { Connection } from "typeorm";
import yup from "yup";

import { validate, validationErrorsToResponse } from "./validators";

import { IRequestResult, PlainRequest, UnauthenticatedRequest } from "./index";

export class PostsController {
  private dbConn: Connection;

  constructor(dbConn: Connection) {
    this.dbConn = dbConn;
  }

  public async getPost(
    req: UnauthenticatedRequest<undefined, { slug: string }>,
    _res: Response,
  ): Promise<IRequestResult<GetPostResponse>> {
    const validateResult = await validate(
      yup
        .object({
          slug: yup.string().required(),
        })
        .required()
        .noUnknown(),
      req.params,
    );
    if (validateResult.errors !== null) {
      return {
        data: validationErrorsToResponse(validateResult.errors),
        status: HTTPStatus.BAD_REQUEST,
      };
    }

    const post = await this.dbConn
      .getRepository(Post)
      .findOne({ where: { slug: validateResult.body.slug } });
    if (typeof post === "undefined" || post === null) {
      const validationResponse: IValidationErrorResponse = {
        notFound: "Not Found",
      };

      return {
        data: validationResponse,
        status: HTTPStatus.NOT_FOUND,
      };
    }

    return {
      data: { post: post.toJson() },
      status: HTTPStatus.OK,
    };
  }

  public async getPosts(
    _req: PlainRequest,
    _res: Response,
  ): Promise<IRequestResult<GetPostsResponse>> {
    const posts = await this.dbConn.getRepository(Post).find({ order: { id: "DESC" }, take: 3 });

    return {
      data: { posts: posts.map(v => v.toJson()) },
      status: HTTPStatus.OK,
    };
  }
}
