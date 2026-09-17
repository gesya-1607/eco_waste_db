/*
  Warnings:

  - The primary key for the `adminbank` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `adminbank` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `appMakerId` on the `adminbank` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `userId` on the `adminbank` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `appmaker` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `appmaker` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `detailsetor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `detailsetor` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `setorSampahId` on the `detailsetor` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `kategoriSampahId` on the `detailsetor` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `hadiah` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `hadiah` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `appMakerId` on the `hadiah` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `kategorisampah` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `kategorisampah` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `appMakerId` on the `kategorisampah` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `nasabah` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `nasabah` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `appMakerId` on the `nasabah` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `userId` on the `nasabah` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `penukaranpoin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `penukaranpoin` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `appMakerId` on the `penukaranpoin` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `nasabahId` on the `penukaranpoin` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `hadiahId` on the `penukaranpoin` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `setorsampah` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `setorsampah` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `appMakerId` on the `setorsampah` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `nasabahId` on the `setorsampah` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `appMakerId` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `adminbank` DROP FOREIGN KEY `AdminBank_appMakerId_fkey`;

-- DropForeignKey
ALTER TABLE `adminbank` DROP FOREIGN KEY `AdminBank_userId_fkey`;

-- DropForeignKey
ALTER TABLE `detailsetor` DROP FOREIGN KEY `DetailSetor_kategoriSampahId_fkey`;

-- DropForeignKey
ALTER TABLE `detailsetor` DROP FOREIGN KEY `DetailSetor_setorSampahId_fkey`;

-- DropForeignKey
ALTER TABLE `hadiah` DROP FOREIGN KEY `Hadiah_appMakerId_fkey`;

-- DropForeignKey
ALTER TABLE `kategorisampah` DROP FOREIGN KEY `KategoriSampah_appMakerId_fkey`;

-- DropForeignKey
ALTER TABLE `nasabah` DROP FOREIGN KEY `Nasabah_appMakerId_fkey`;

-- DropForeignKey
ALTER TABLE `nasabah` DROP FOREIGN KEY `Nasabah_userId_fkey`;

-- DropForeignKey
ALTER TABLE `penukaranpoin` DROP FOREIGN KEY `PenukaranPoin_appMakerId_fkey`;

-- DropForeignKey
ALTER TABLE `penukaranpoin` DROP FOREIGN KEY `PenukaranPoin_hadiahId_fkey`;

-- DropForeignKey
ALTER TABLE `penukaranpoin` DROP FOREIGN KEY `PenukaranPoin_nasabahId_fkey`;

-- DropForeignKey
ALTER TABLE `setorsampah` DROP FOREIGN KEY `SetorSampah_appMakerId_fkey`;

-- DropForeignKey
ALTER TABLE `setorsampah` DROP FOREIGN KEY `SetorSampah_nasabahId_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_appMakerId_fkey`;

-- AlterTable
ALTER TABLE `adminbank` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `appMakerId` INTEGER NOT NULL,
    MODIFY `userId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `appmaker` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `detailsetor` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `setorSampahId` INTEGER NOT NULL,
    MODIFY `kategoriSampahId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `hadiah` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `appMakerId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `kategorisampah` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `appMakerId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `nasabah` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `appMakerId` INTEGER NOT NULL,
    MODIFY `userId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `penukaranpoin` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `appMakerId` INTEGER NOT NULL,
    MODIFY `nasabahId` INTEGER NOT NULL,
    MODIFY `hadiahId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `setorsampah` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `appMakerId` INTEGER NOT NULL,
    MODIFY `nasabahId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `appMakerId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `adminbank` ADD CONSTRAINT `AdminBank_appMakerId_fkey` FOREIGN KEY (`appMakerId`) REFERENCES `appmaker`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `adminbank` ADD CONSTRAINT `AdminBank_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detailsetor` ADD CONSTRAINT `DetailSetor_kategoriSampahId_fkey` FOREIGN KEY (`kategoriSampahId`) REFERENCES `kategorisampah`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detailsetor` ADD CONSTRAINT `DetailSetor_setorSampahId_fkey` FOREIGN KEY (`setorSampahId`) REFERENCES `setorsampah`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hadiah` ADD CONSTRAINT `Hadiah_appMakerId_fkey` FOREIGN KEY (`appMakerId`) REFERENCES `appmaker`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kategorisampah` ADD CONSTRAINT `KategoriSampah_appMakerId_fkey` FOREIGN KEY (`appMakerId`) REFERENCES `appmaker`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `nasabah` ADD CONSTRAINT `Nasabah_appMakerId_fkey` FOREIGN KEY (`appMakerId`) REFERENCES `appmaker`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `nasabah` ADD CONSTRAINT `Nasabah_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `penukaranpoin` ADD CONSTRAINT `PenukaranPoin_appMakerId_fkey` FOREIGN KEY (`appMakerId`) REFERENCES `appmaker`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `penukaranpoin` ADD CONSTRAINT `PenukaranPoin_hadiahId_fkey` FOREIGN KEY (`hadiahId`) REFERENCES `hadiah`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `penukaranpoin` ADD CONSTRAINT `PenukaranPoin_nasabahId_fkey` FOREIGN KEY (`nasabahId`) REFERENCES `nasabah`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `setorsampah` ADD CONSTRAINT `SetorSampah_appMakerId_fkey` FOREIGN KEY (`appMakerId`) REFERENCES `appmaker`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `setorsampah` ADD CONSTRAINT `SetorSampah_nasabahId_fkey` FOREIGN KEY (`nasabahId`) REFERENCES `nasabah`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `User_appMakerId_fkey` FOREIGN KEY (`appMakerId`) REFERENCES `appmaker`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
