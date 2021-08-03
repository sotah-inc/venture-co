import { GetPostResponse, GetPostsResponse, IValidationErrorResponse } from "@sotah-inc/core";
import { Post } from "@sotah-inc/server";
import HTTPStatus from "http-status";
import { Connection } from "typeorm";

import { IRequestResult } from "./index";

export class PostsController {
  private dbConn: Connection;

  constructor(dbConn: Connection) {
    this.dbConn = dbConn;
  }

  public async getPost(slug: string): Promise<IRequestResult<GetPostResponse>> {
    const post = await this.dbConn.getRepository(Post).findOne({ where: { slug } });
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

  public async getPosts(): Promise<IRequestResult<GetPostsResponse>> {
    const posts = await this.dbConn.getRepository(Post).find({ order: { id: "DESC" }, take: 3 });

    return {
      data: { posts: posts.map(v => v.toJson()) },
      status: HTTPStatus.OK,
    };
  }
}
