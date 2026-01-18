import path from "node:path";

export const DATABASE_FILENAME = "dev.db";
export const DATABASE_PATH = path.resolve(
  path.join(process.cwd(), "src", "prisma", DATABASE_FILENAME),
);
export const DATABASE_URL = `file:${DATABASE_PATH}`;
