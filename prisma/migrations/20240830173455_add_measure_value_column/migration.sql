/*
  Warnings:

  - You are about to drop the column `confirmed` on the `Measure` table. All the data in the column will be lost.
  - You are about to drop the column `confirmed_value` on the `Measure` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Measure` DROP COLUMN `confirmed`,
    DROP COLUMN `confirmed_value`,
    ADD COLUMN `has_confirmed` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `image_url` VARCHAR(191) NULL,
    ADD COLUMN `measure_value` DOUBLE NULL;
