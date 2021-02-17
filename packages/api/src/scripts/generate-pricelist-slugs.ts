import { connectDatabase, Pricelist } from "@sotah-inc/server";
import * as process from "process";
import "reflect-metadata";
import getSlug from "speakingurl";
import { v4 as uuidv4 } from "uuid";

(async () => {
  const dbHost = process.env.DB_HOST ?? "";
  const dbConn = await connectDatabase({
    connectionName: `app-${uuidv4()}`,
    dbHostname: dbHost,
    dbName: "postgres",
    password: "",
    port: 5432,
    username: "postgres",
  });

  const posts = await dbConn.getRepository(Pricelist).find({
    where: { slug: null },
  });
  await Promise.all(
    posts.map(v => {
      v.slug = getSlug(v.name);

      return dbConn.manager.save(v);
    }),
  );

  process.exit(0);
})();
