import path from "path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prismagl";

const dbPath = path.resolve(process.cwd(), "src/prisma/dev.db");

const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

export { prisma };
