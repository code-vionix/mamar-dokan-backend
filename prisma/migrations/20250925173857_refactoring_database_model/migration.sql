/*
  Warnings:

  - You are about to drop the column `flashDiscount` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `flashSale` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `flashSaleEnd` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `flashSalePrice` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `flashSaleStart` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `flashSaleStatus` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `inventoryQuantity` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `maxQtyPerCustomer` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `metaDescription` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `metaTitle` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `onSale` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `trackInventory` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `brands` table. All the data in the column will be lost.
  - You are about to drop the column `metaDescription` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `metaTitle` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `parentId` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `productName` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `variantId` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `variantName` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `orderNumber` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `paymentId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `comment` on the `product_reviews` table. All the data in the column will be lost.
  - You are about to drop the column `isApproved` on the `product_reviews` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `product_reviews` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `product_reviews` table. All the data in the column will be lost.
  - You are about to drop the column `company` on the `user_addresses` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `user_addresses` table. All the data in the column will be lost.
  - You are about to drop the `CartSummary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductFeature` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductShippingInfo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductSpecification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cart_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_images` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_variants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `review_votes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `shopping_carts` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `userId` on table `orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `orderId` on table `product_reviews` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."CartSummary" DROP CONSTRAINT "CartSummary_cartId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CartSummary" DROP CONSTRAINT "CartSummary_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductFeature" DROP CONSTRAINT "ProductFeature_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductShippingInfo" DROP CONSTRAINT "ProductShippingInfo_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductSpecification" DROP CONSTRAINT "ProductSpecification_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."brands" DROP CONSTRAINT "brands_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."cart_items" DROP CONSTRAINT "cart_items_cartId_fkey";

-- DropForeignKey
ALTER TABLE "public"."cart_items" DROP CONSTRAINT "cart_items_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."cart_items" DROP CONSTRAINT "cart_items_variantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."categories" DROP CONSTRAINT "categories_parentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."order_items" DROP CONSTRAINT "order_items_variantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."orders" DROP CONSTRAINT "orders_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."product_images" DROP CONSTRAINT "product_images_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."product_variants" DROP CONSTRAINT "product_variants_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."review_votes" DROP CONSTRAINT "review_votes_reviewId_fkey";

-- DropForeignKey
ALTER TABLE "public"."review_votes" DROP CONSTRAINT "review_votes_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."shopping_carts" DROP CONSTRAINT "shopping_carts_userId_fkey";

-- DropIndex
DROP INDEX "public"."orders_orderNumber_key";

-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "flashDiscount",
DROP COLUMN "flashSale",
DROP COLUMN "flashSaleEnd",
DROP COLUMN "flashSalePrice",
DROP COLUMN "flashSaleStart",
DROP COLUMN "flashSaleStatus",
DROP COLUMN "inventoryQuantity",
DROP COLUMN "maxQtyPerCustomer",
DROP COLUMN "metaDescription",
DROP COLUMN "metaTitle",
DROP COLUMN "onSale",
DROP COLUMN "status",
DROP COLUMN "trackInventory",
ADD COLUMN     "images" TEXT[];

-- AlterTable
ALTER TABLE "public"."brands" DROP COLUMN "categoryId";

-- AlterTable
ALTER TABLE "public"."categories" DROP COLUMN "metaDescription",
DROP COLUMN "metaTitle",
DROP COLUMN "parentId";

-- AlterTable
ALTER TABLE "public"."order_items" DROP COLUMN "imageUrl",
DROP COLUMN "productName",
DROP COLUMN "variantId",
DROP COLUMN "variantName";

-- AlterTable
ALTER TABLE "public"."orders" DROP COLUMN "orderNumber",
DROP COLUMN "paymentId",
ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "currency" SET DEFAULT 'BDT';

-- AlterTable
ALTER TABLE "public"."product_reviews" DROP COLUMN "comment",
DROP COLUMN "isApproved",
DROP COLUMN "isVerified",
DROP COLUMN "title",
ADD COLUMN     "review" TEXT,
ALTER COLUMN "orderId" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."user_addresses" DROP COLUMN "company",
DROP COLUMN "state";

-- DropTable
DROP TABLE "public"."CartSummary";

-- DropTable
DROP TABLE "public"."ProductFeature";

-- DropTable
DROP TABLE "public"."ProductShippingInfo";

-- DropTable
DROP TABLE "public"."ProductSpecification";

-- DropTable
DROP TABLE "public"."cart_items";

-- DropTable
DROP TABLE "public"."product_images";

-- DropTable
DROP TABLE "public"."product_variants";

-- DropTable
DROP TABLE "public"."review_votes";

-- DropTable
DROP TABLE "public"."shopping_carts";

-- DropEnum
DROP TYPE "public"."FlashSaleStatus";

-- DropEnum
DROP TYPE "public"."StockStatus";

-- CreateTable
CREATE TABLE "public"."stocks" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "reserved" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stocks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stocks_productId_key" ON "public"."stocks"("productId");

-- AddForeignKey
ALTER TABLE "public"."stocks" ADD CONSTRAINT "stocks_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_reviews" ADD CONSTRAINT "product_reviews_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
