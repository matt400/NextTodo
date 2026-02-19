/*
  Warnings:

  - Added the required column `modified` to the `Tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taskDesc` to the `Tasks` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tasks" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "taskName" TEXT NOT NULL,
    "taskDesc" TEXT NOT NULL,
    "created" DATETIME NOT NULL,
    "modified" DATETIME NOT NULL,
    "isFinished" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Tasks" ("created", "id", "isFinished", "taskName", "userId") SELECT "created", "id", "isFinished", "taskName", "userId" FROM "Tasks";
DROP TABLE "Tasks";
ALTER TABLE "new_Tasks" RENAME TO "Tasks";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
