/*
  Warnings:

  - The primary key for the `address` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `address` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `address` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the `register_mosque` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[mosqueId]` on the table `Address` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mosqueId` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `register_mosque` DROP FOREIGN KEY `register_mosque_addressId_fkey`;

-- AlterTable
ALTER TABLE `address` DROP PRIMARY KEY,
    DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `mosqueId` INTEGER NOT NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `register_mosque`;

-- CreateTable
CREATE TABLE `RegisterMosque` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mosqueName` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `mosqueAdmin` VARCHAR(191) NOT NULL,
    `contactPerson` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Address_mosqueId_key` ON `Address`(`mosqueId`);

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_mosqueId_fkey` FOREIGN KEY (`mosqueId`) REFERENCES `RegisterMosque`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
