/*
  Warnings:

  - The primary key for the `Pomo` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pomo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "taskId" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pausedAt" DATETIME,
    "elapsed" INTEGER NOT NULL DEFAULT 0,
    "endedAt" DATETIME
);
INSERT INTO "new_Pomo" ("duration", "elapsed", "endedAt", "id", "pausedAt", "startedAt", "taskId", "userId") SELECT "duration", "elapsed", "endedAt", "id", "pausedAt", "startedAt", "taskId", "userId" FROM "Pomo";
DROP TABLE "Pomo";
ALTER TABLE "new_Pomo" RENAME TO "Pomo";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
