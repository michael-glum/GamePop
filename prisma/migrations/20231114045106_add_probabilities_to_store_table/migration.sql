-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Store" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "lowDiscountId" TEXT,
    "midDiscountId" TEXT,
    "highDiscountId" TEXT,
    "lowPctOff" REAL NOT NULL DEFAULT 0.1,
    "midPctOff" REAL NOT NULL DEFAULT 0.2,
    "highPctOff" REAL NOT NULL DEFAULT 0.3,
    "lowProb" REAL NOT NULL DEFAULT 0.2,
    "midProb" REAL NOT NULL DEFAULT 0.6,
    "highProb" REAL NOT NULL DEFAULT 0.2,
    "totalSales" REAL NOT NULL DEFAULT 0,
    "currSales" REAL NOT NULL DEFAULT 0,
    "lastUpdated" TEXT,
    "lastPayment" REAL,
    "isInstalled" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_Store" ("currSales", "highDiscountId", "highPctOff", "id", "isInstalled", "lastPayment", "lastUpdated", "lowDiscountId", "lowPctOff", "midDiscountId", "midPctOff", "shop", "totalSales") SELECT "currSales", "highDiscountId", "highPctOff", "id", "isInstalled", "lastPayment", "lastUpdated", "lowDiscountId", "lowPctOff", "midDiscountId", "midPctOff", "shop", "totalSales" FROM "Store";
DROP TABLE "Store";
ALTER TABLE "new_Store" RENAME TO "Store";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
