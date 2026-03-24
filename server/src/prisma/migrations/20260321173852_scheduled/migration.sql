-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tasks" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "taskName" TEXT NOT NULL,
    "taskDesc" TEXT NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scheduled" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified" DATETIME NOT NULL,
    "isFinished" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Tasks" ("created", "id", "isFinished", "modified", "taskDesc", "taskName", "userId") SELECT "created", "id", "isFinished", "modified", "taskDesc", "taskName", "userId" FROM "Tasks";
DROP TABLE "Tasks";
ALTER TABLE "new_Tasks" RENAME TO "Tasks";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
