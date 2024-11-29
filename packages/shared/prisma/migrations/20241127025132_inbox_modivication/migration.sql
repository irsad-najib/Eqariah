-- DropForeignKey
ALTER TABLE `inbox_read` DROP FOREIGN KEY `fk_inbox_read_inbox`;

-- DropForeignKey
ALTER TABLE `inbox_read` DROP FOREIGN KEY `fx_inbor_read_users`;

-- AddForeignKey
ALTER TABLE `inbox_read` ADD CONSTRAINT `inbox_read_inbox_id_fkey` FOREIGN KEY (`inbox_id`) REFERENCES `inbox`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inbox_read` ADD CONSTRAINT `inbox_read_users_id_fkey` FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
