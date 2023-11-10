-- CreateTable
CREATE TABLE "Store" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "lowDiscountId" TEXT,
    "midDiscountId" TEXT,
    "highDiscountId" TEXT,
    "lowPctOff" REAL NOT NULL DEFAULT 0.1,
    "midPctOff" REAL NOT NULL DEFAULT 0.2,
    "highPctOff" REAL NOT NULL DEFAULT 0.3,
    "totalSales" REAL NOT NULL DEFAULT 0,
    "currSales" REAL NOT NULL DEFAULT 0,
    "lastUpdated" TEXT,
    "lastPayment" REAL,
    "isInstalled" BOOLEAN NOT NULL DEFAULT true
);
