import "reflect-metadata";

import test from "ava";
import * as HttpStatus from "http-status";

import { getLogger } from "../..";
import { setup } from "../../lib/test-helper";

const helper = async () => {
  const { request } = await setup({
    dbHost: "5432",
    isGceEnv: false,
    logger: getLogger(),
    natsHost: "127.0.0.1",
    natsPort: "4222",
  });

  return { request };
};

test("Homepage Should return standard greeting", async t => {
  const { request } = await helper();

  const res = await request.get("/");
  t.is(res.status, HttpStatus.OK);
  t.is(res.text, "Hello, world!");
});

test("Ping Should return pong", async t => {
  const { request } = await helper();

  const res = await request.get("/ping");
  t.is(res.status, HttpStatus.OK);
  t.is(res.text, "Pong");
});

// tslint:disable-next-line:ban
test.only("Internal-error Should return 500", async t => {
  const { request } = await helper();

  const res = await request.get("/internal-error");
  t.is(res.status, HttpStatus.INTERNAL_SERVER_ERROR, "Http status is NOT_FOUND");
});
