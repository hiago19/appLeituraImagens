/*
  Warnings:

  - Added the required column `image_extension` to the `Measure` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Measure` ADD COLUMN `image_extension` VARCHAR(191) NOT NULL;
