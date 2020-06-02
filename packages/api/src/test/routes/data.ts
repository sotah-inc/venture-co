import * as process from "process";
import "reflect-metadata";

import { SortDirection, SortKind } from "@sotah-inc/core";
import test from "ava";
import * as HttpStatus from "http-status";

import { getLogger } from "../..";
import { setup } from "../../lib/test-helper";

const helper = async () => {
  const { request, messenger } = await setup({
    dbHost: process.env["DB_HOST"] as string,
    isGceEnv: false,
    logger: getLogger(),
    natsHost: process.env["NATS_HOST"] as string,
    natsPort: process.env["NATS_PORT"] as string,
  });

  return { request, messenger };
};

test("Status Should return status information", async t => {
  const { request, messenger } = await helper();

  const tId = setTimeout(() => {
    throw new Error("Timed out!");
  }, 5 * 1000);

  const { regions } = (await (await messenger.getBoot()).decode())!;
  t.true(regions.length > 0);

  // tslint:disable-next-line:no-console
  console.log(`/region/${regions[0].config_region.name}/realms`);

  const res = await request.get(`/region/${regions[0].config_region.name}/connected-realms`);
  clearTimeout(tId);

  t.is(res.status, HttpStatus.OK, "Http status is OK");
});

test("Status Should return auction information", async t => {
  const { request, messenger } = await helper();

  const tId = setTimeout(() => {
    throw new Error("Timed out!");
  }, 5 * 1000);

  const { regions } = (await (await messenger.getBoot()).decode())!;
  const [region] = regions;
  const [connectedRealm] = (await (
    await messenger.getStatus({ region_name: region.config_region.name })
  ).decode())!.connected_realms;
  const res = await request
    .get(
      `/region/${region.config_region.name}/connected-realm/${connectedRealm.connected_realm.id}/auctions`,
    )
    .send({
      count: 10,
      page: 0,
      sortDirection: SortDirection.none,
      sortKind: SortKind.none,
    });
  clearTimeout(tId);

  t.is(res.status, HttpStatus.OK, "Http status is OK");
});

test("Status Should return return 404 on invalid region name in auctions", async t => {
  const { request } = await helper();

  const tId = setTimeout(() => {
    throw new Error("Timed out!");
  }, 5 * 1000);

  const res = await request.post("/region/fdsfgs/connected-realm/fdsfgs/auctions");
  clearTimeout(tId);

  t.is(res.status, HttpStatus.NOT_FOUND, "Http status is NOT_FOUND");
});

test("Status Should return 400 on invalid count", async t => {
  const { request, messenger } = await helper();

  const tId = setTimeout(() => {
    throw new Error("Timed out!");
  }, 5 * 1000);

  const { regions } = (await (await messenger.getBoot()).decode())!;
  const [region] = regions;
  const [connectedRealm] = (await (
    await messenger.getStatus({ region_name: region.config_region.name })
  ).decode())!.connected_realms;
  const res = await request
    .post(
      `/region/${region.config_region.name}/connected-realm/${connectedRealm.connected_realm.id}/auctions`,
    )
    .send({ count: 0 });
  clearTimeout(tId);

  t.is(res.status, HttpStatus.BAD_REQUEST);
  t.deepEqual(res.body, { error: "Count must be >0" });
});

test("Status Should return 404 on invalid region name", async t => {
  const { request } = await helper();

  const tId = setTimeout(() => {
    throw new Error("Timed out!");
  }, 5 * 1000);

  const res = await request.get("/region/fdsfgs/connected-realms");
  clearTimeout(tId);

  t.is(res.status, HttpStatus.NOT_FOUND, "Http status is NOT_FOUND");
});
