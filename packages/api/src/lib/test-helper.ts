import {
  ICreatePostRequest,
  ICreatePostResponse,
  ICreatePricelistRequest,
  ICreatePricelistResponse,
  ICreateProfessionPricelistRequest,
  ICreateProfessionPricelistResponse,
  ICreateUserRequest,
  ICreateUserResponse,
} from "@sotah-inc/core";
import {
  Messenger,
  Post,
  Preference,
  Pricelist,
  PricelistEntry,
  ProfessionPricelist,
  User,
} from "@sotah-inc/server";
import { ExecutionContext } from "ava";
import { Express } from "express";
import * as HTTPStatus from "http-status";
import * as nats from "nats";
import supertest from "supertest";
import { Connection, createConnection } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { getApp, IOptions } from "./app";

// setup func
interface ISetupSettings {
  app: Express;
  messenger: Messenger;
  dbConn: Connection;
  request: supertest.SuperTest<supertest.Test>;
}

export const setup = async (opts: IOptions): Promise<ISetupSettings> => {
  const app = await getApp(opts);
  const request = supertest(app);
  const messenger = new Messenger(
    nats.connect({ url: `nats://${opts.natsHost}:${opts.natsPort}` }),
  );
  const dbConn = await createConnection({
    database: "postgres",
    entities: [Preference, Pricelist, PricelistEntry, ProfessionPricelist, User, Post],
    host: opts.dbHost,
    logging: false,
    name: `test-${uuidv4()}`,
    password: "",
    port: 5432,
    synchronize: false,
    type: "postgres",
    username: "postgres",
  });

  return { app: app!, messenger, dbConn, request };
};

// user test-helper
const getUserTestHelper = (request: supertest.SuperTest<supertest.Test>) => {
  const requestUser = (body: ICreateUserRequest) => request.post("/users").send(body);
  const createUser = async (t: ExecutionContext, body: ICreateUserRequest) => {
    const res = await requestUser(body);
    t.is(res.status, HTTPStatus.CREATED);
    t.not(String(res.header["content-type"]).match(/^application\/json/), null);

    const responseBody: ICreateUserResponse = res.body;
    t.true("user" in responseBody);
    t.true("id" in responseBody.user);
    t.is(typeof responseBody.user.id, "number");

    return responseBody.user;
  };

  return { requestUser, createUser };
};

// pricelist test-helper
const getPricelistTestHelper = (request: supertest.SuperTest<supertest.Test>) => {
  const requestPricelist = (token: string, body: ICreatePricelistRequest) => {
    return request
      .post("/user/pricelists")
      .set("Authorization", `Bearer ${token}`)
      .send(body);
  };
  const createPricelist = async (
    t: ExecutionContext,
    token: string,
    body: ICreatePricelistRequest,
  ): Promise<ICreatePricelistResponse> => {
    const res = await requestPricelist(token, body);
    const { status, body: responseBody, header } = res;
    t.is(status, HTTPStatus.CREATED);
    t.not(String(header["content-type"]).match(/^application\/json/), null);

    t.true("pricelist" in responseBody);
    const { pricelist } = responseBody;
    t.is(pricelist.name, body.pricelist.name);

    t.true("entries" in body);
    const { entries } = responseBody;
    t.is(entries.length, body.entries.length);
    t.not(entries[0].id, null);

    return responseBody;
  };

  return { requestPricelist, createPricelist };
};

const getProfessionPricelistTestHelper = (request: supertest.SuperTest<supertest.Test>) => {
  const requestProfessionPricelist = (token: string, body: ICreateProfessionPricelistRequest) => {
    return request
      .post("/user/profession-pricelists")
      .set("Authorization", `Bearer ${token}`)
      .send(body);
  };
  const createProfessionPricelist = async (
    t: ExecutionContext,
    token: string,
    body: ICreateProfessionPricelistRequest,
  ): Promise<ICreateProfessionPricelistResponse> => {
    const res = await requestProfessionPricelist(token, body);
    const { status, body: responseBody, header } = res;
    t.is(status, HTTPStatus.CREATED);
    t.not(String(header["content-type"]).match(/^application\/json/), null);

    t.true("profession_pricelist" in responseBody);
    const { profession_pricelist } = responseBody;
    t.is(profession_pricelist.name, body.profession_name);

    t.true("pricelist" in responseBody);
    const { pricelist } = responseBody;
    t.is(pricelist.name, body.pricelist.name);

    t.true("entries" in responseBody);
    const { entries } = responseBody;
    t.is(entries.length, body.entries.length);
    t.not(entries[0].id, null);

    return responseBody;
  };

  return { requestProfessionPricelist, createProfessionPricelist };
};

const getPostTestHelper = (request: supertest.SuperTest<supertest.Test>) => {
  const requestPost = (token: string, body: ICreatePostRequest) => {
    return request
      .post("/user/posts")
      .set("Authorization", `Bearer ${token}`)
      .send(body);
  };
  const createPost = async (
    t: ExecutionContext,
    token: string,
    body: ICreatePostRequest,
  ): Promise<ICreatePostResponse> => {
    const res = await requestPost(token, body);
    const { status, body: responseBody, header } = res;
    t.is(status, HTTPStatus.CREATED);
    t.not(String(header["content-type"]).match(/^application\/json/), null);

    return responseBody;
  };

  return { requestPost, createPost };
};

// final test-helper
export const getTestHelper = (request: supertest.SuperTest<supertest.Test>) => {
  return {
    ...getUserTestHelper(request),
    ...getPricelistTestHelper(request),
    ...getProfessionPricelistTestHelper(request),
    ...getPostTestHelper(request),
  };
};
