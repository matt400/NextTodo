import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prismagl";
import { DATABASE_PATH } from "../server.config";

const adapter = new PrismaBetterSqlite3({ url: DATABASE_PATH });
const prisma = new PrismaClient({ adapter });

export { prisma };
