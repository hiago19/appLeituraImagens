-- CreateTable
CREATE TABLE `Measure` (
    `uuid` VARCHAR(191) NOT NULL,
    `confirmed_value` DOUBLE NULL,
    `confirmed` BOOLEAN NOT NULL DEFAULT false,
    `customer_code` VARCHAR(191) NOT NULL,
    `measure_type` VARCHAR(191) NOT NULL,
    `measure_datetime` DATETIME(3) NOT NULL,

    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
