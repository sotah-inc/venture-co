import { AbstractRepository, EntityRepository } from "typeorm";

import { Post } from "./post";

@EntityRepository(Post)
export class PostRepository extends AbstractRepository<Post> {
  public async hasNoSlug(slug: string, exceptSlug?: string): Promise<boolean> {
    const foundPost = await this.repository.findOne({ where: { slug } });
    if (typeof foundPost === "undefined") {
      return true;
    }

    if (typeof exceptSlug === "undefined") {
      return true;
    }

    return foundPost.slug === exceptSlug;
  }

  public async getWithUser(id: number): Promise<Post | null> {
    const post = await this.repository
      .createQueryBuilder("post")
      .innerJoinAndSelect("post.user", "user")
      .where({ id })
      .getOne();

    if (typeof post === "undefined") {
      return null;
    }

    return post;
  }
}
