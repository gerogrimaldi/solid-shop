/*
  Warnings:

  - A unique constraint covering the columns `[wishlistId,productId]` on the table `WishlistItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `WishlistItem_wishlistId_productId_key` ON `WishlistItem`(`wishlistId`, `productId`);
