/*
  Warnings:

  - You are about to drop the column `languages` on the `Book_Z` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,language,warehouseType]` on the table `Book_Z` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `language` to the `Book_Z` table without a default value. This is not possible if the table is not empty.
  - Added the required column `warehouseType` to the `Book_Z` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inventoryType` to the `Inventory_Z` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."BookLanguage" AS ENUM ('HINDI', 'ENGLISH', 'TELUGU');

-- CreateEnum
CREATE TYPE "public"."WarehouseType" AS ENUM ('NORMAL', 'VEC');

-- CreateEnum
CREATE TYPE "public"."InventoryType" AS ENUM ('WAREHOUSE', 'DISTRIBUTOR');

-- AlterTable
ALTER TABLE "public"."Book_Z" DROP COLUMN "languages",
ADD COLUMN     "language" "public"."BookLanguage" NOT NULL,
ADD COLUMN     "warehouseType" "public"."WarehouseType" NOT NULL;

-- AlterTable
ALTER TABLE "public"."Inventory_Z" ADD COLUMN     "inventoryType" "public"."InventoryType" NOT NULL,
ADD COLUMN     "warehouseType" "public"."StoreType_ZEnum";

-- CreateIndex
CREATE INDEX "Book_Z_category_idx" ON "public"."Book_Z"("category");

-- CreateIndex
CREATE INDEX "Book_Z_warehouseType_idx" ON "public"."Book_Z"("warehouseType");

-- CreateIndex
CREATE UNIQUE INDEX "Book_Z_name_language_warehouseType_key" ON "public"."Book_Z"("name", "language", "warehouseType");

-- CreateIndex
CREATE INDEX "Inventory_Z_inventoryType_idx" ON "public"."Inventory_Z"("inventoryType");

-- CreateIndex
CREATE INDEX "Inventory_Z_warehouseType_idx" ON "public"."Inventory_Z"("warehouseType");
