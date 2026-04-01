/*
  Warnings:

  - You are about to drop the column `isActive` on the `Pomo` table. All the data in the column will be lost.
  - You are about to drop the column `timeLeft` on the `Pomo` table. All the data in the column will be lost.
  - Added the required column `duration` to the `Pomo` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pomo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "taskId" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pausedAt" DATETIME,
    "elapsed" INTEGER NOT NULL DEFAULT 0,
    "endedAt" DATETIME
);
INSERT INTO "new_Pomo" ("id", "taskId", "userId") SELECT "id", "taskId", "userId" FROM "Pomo";
DROP TABLE "Pomo";
ALTER TABLE "new_Pomo" RENAME TO "Pomo";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
