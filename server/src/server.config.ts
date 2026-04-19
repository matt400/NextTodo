import path from "node:path";

const isProd = process.env.NODE_ENV === "production";

export const DATABASE_FILENAME = "nexttodo.db";

export const DATABASE_PATH = isProd
  ? // Production (SEA)
    path.join(path.dirname(process.execPath), DATABASE_FILENAME)
  : // Development: src/prisma/dev.db
    path.resolve(process.cwd(), "src", "prisma", "dev.db");

export const DATABASE_URL = process.env.DATABASE_URL ?? `file:${DATABASE_PATH}`;
