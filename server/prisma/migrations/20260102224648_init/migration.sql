-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "lastLogin" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Tasks" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "taskName" TEXT NOT NULL,
    "created" DATETIME NOT NULL,
    "isFinished" BOOLEAN NOT NULL,
    "userId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Pomo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "timeLeft" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "taskId" INTEGER NOT NULL
);
