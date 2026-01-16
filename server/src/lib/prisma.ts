import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/index.js";

const adapter = new PrismaBetterSqlite3({
  url: "file:./src/prisma/dev.db",
});

const prisma = new PrismaClient({ adapter });

export { prisma };
