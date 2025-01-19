-- CreateTable
CREATE TABLE `category` (
    `id` VARCHAR(100) NOT NULL,
    `name` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `category_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inbox` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `detail` TEXT NOT NULL,
    `create_at` TIMESTAMP(0) NOT NULL,
    `user_id` INTEGER NULL,
    `category_id` VARCHAR(100) NULL,

    INDEX `fk_inbox_category`(`category_id`),
    INDEX `fk_inbox_user`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inbox_read` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `is_read` BOOLEAN NOT NULL,
    `inbox_id` INTEGER NOT NULL,
    `users_id` INTEGER NOT NULL,

    INDEX `fk_inbox_read_inbox`(`inbox_id`),
    INDEX `fx_inbor_read_users`(`users_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `pass` VARCHAR(255) NOT NULL,
    `create_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `role` VARCHAR(191) NULL DEFAULT 'user',

    UNIQUE INDEX `users_username_key`(`username`),
    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `address` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `street` VARCHAR(191) NOT NULL,
    `rt` VARCHAR(191) NOT NULL,
    `rw` VARCHAR(191) NOT NULL,
    `village` VARCHAR(191) NOT NULL,
    `district` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `province` VARCHAR(191) NOT NULL,
    `postalCode` VARCHAR(191) NOT NULL,
    `mosqueId` INTEGER NOT NULL,

    UNIQUE INDEX `Address_mosqueId_key`(`mosqueId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `registermosque` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mosqueName` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `mosqueAdmin` VARCHAR(191) NOT NULL,
    `contactPerson` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `inbox` ADD CONSTRAINT `fk_inbox_category` FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `inbox` ADD CONSTRAINT `fk_inbox_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `inbox_read` ADD CONSTRAINT `inbox_read_inbox_id_fkey` FOREIGN KEY (`inbox_id`) REFERENCES `inbox`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inbox_read` ADD CONSTRAINT `inbox_read_users_id_fkey` FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `address` ADD CONSTRAINT `Address_mosqueId_fkey` FOREIGN KEY (`mosqueId`) REFERENCES `registermosque`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
