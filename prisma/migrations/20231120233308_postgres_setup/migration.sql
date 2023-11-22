-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "scope" TEXT,
    "expires" TIMESTAMP(3),
    "accessToken" TEXT NOT NULL,
    "userId" BIGINT,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Store" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "lowDiscountId" TEXT,
    "midDiscountId" TEXT,
    "highDiscountId" TEXT,
    "lowPctOff" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
    "midPctOff" DOUBLE PRECISION NOT NULL DEFAULT 0.2,
    "highPctOff" DOUBLE PRECISION NOT NULL DEFAULT 0.3,
    "lowProb" DOUBLE PRECISION NOT NULL DEFAULT 0.2,
    "midProb" DOUBLE PRECISION NOT NULL DEFAULT 0.6,
    "highProb" DOUBLE PRECISION NOT NULL DEFAULT 0.2,
    "useWordGame" BOOLEAN NOT NULL DEFAULT true,
    "useBirdGame" BOOLEAN NOT NULL DEFAULT true,
    "totalSales" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currSales" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastUpdated" TEXT,
    "lastPayment" DOUBLE PRECISION,
    "isInstalled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "wordGamesPlayed" INTEGER NOT NULL DEFAULT 0,
    "wordGamesTotal" INTEGER NOT NULL DEFAULT 0,
    "wordGameBest" INTEGER NOT NULL DEFAULT 0,
    "birdGamesPlayed" INTEGER NOT NULL DEFAULT 0,
    "birdGamesTotal" INTEGER NOT NULL DEFAULT 0,
    "birdGameBest" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
