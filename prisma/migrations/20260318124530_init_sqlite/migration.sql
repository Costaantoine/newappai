-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "price" INTEGER NOT NULL,
    "images" TEXT NOT NULL DEFAULT '[]',
    "category" TEXT NOT NULL DEFAULT '',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Text" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "fr" TEXT NOT NULL,
    "en" TEXT NOT NULL DEFAULT '',
    "pt" TEXT NOT NULL DEFAULT '',
    "es" TEXT NOT NULL DEFAULT '',
    "section" TEXT NOT NULL DEFAULT '',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Zone" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "title_key" TEXT NOT NULL,
    "subtitle_key" TEXT NOT NULL DEFAULT '',
    "badge" TEXT NOT NULL DEFAULT '',
    "color" TEXT NOT NULL DEFAULT 'sky',
    "url" TEXT NOT NULL DEFAULT '',
    "cta_key" TEXT NOT NULL DEFAULT '',
    "newtab_key" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ZoneCard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "zone_id" TEXT NOT NULL,
    "title_key" TEXT NOT NULL,
    "description_key" TEXT NOT NULL DEFAULT '',
    "badge_key" TEXT NOT NULL DEFAULT '',
    "image_url" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "ZoneCard_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "Zone" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Solution" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "fr" TEXT NOT NULL,
    "en" TEXT NOT NULL DEFAULT '',
    "pt" TEXT NOT NULL DEFAULT '',
    "es" TEXT NOT NULL DEFAULT '',
    "section" TEXT NOT NULL DEFAULT 'solutions',
    "type" TEXT NOT NULL DEFAULT 'description',
    "category" TEXT NOT NULL DEFAULT 'general',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "stripe_session_id" TEXT NOT NULL,
    "product_id" TEXT,
    "customer_email" TEXT,
    "amount" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Order_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'main',
    "data" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_stripe_session_id_key" ON "Order"("stripe_session_id");
