-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "wordGamesPlayed" INTEGER NOT NULL DEFAULT 0,
    "wordGamesTotal" INTEGER NOT NULL DEFAULT 0,
    "wordGameBest" INTEGER NOT NULL DEFAULT 0,
    "birdGamesPlayed" INTEGER NOT NULL DEFAULT 0,
    "birdGamesTotal" INTEGER NOT NULL DEFAULT 0,
    "birdGameBest" INTEGER NOT NULL DEFAULT 0
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
