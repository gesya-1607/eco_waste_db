/*
  Warnings:

  - The primary key for the `AdminBank` table will be changed.
  - You are about to alter the column `id` on the `AdminBank` table.
  - You are about to alter the column `appMakerId` on the `AdminBank` table.
  - You are about to alter the column `userId` on the `AdminBank` table.
  - The primary key for the `AppMaker` table will be changed.
  - The primary key for the `DetailSetor` table will be changed.
  - The primary key for the `Hadiah` table will be changed.
  - The primary key for the `KategoriSampah` table will be changed.
  - The primary key for the `Nasabah` table will be changed.
  - The primary key for the `PenukaranPoin` table will be changed.
  - The primary key for the `SetorSampah` table will be changed.
  - The primary key for the `User` table will be changed.
*/

-- DropForeignKey
ALTER TABLE `AdminBank` DROP FOREIGN KEY `AdminBank_appMakerId_fkey`;

-- DropForeignKey
ALTER TABLE `AdminBank` DROP FOREIGN KEY `AdminBank_userId_fkey`;

-- DropForeignKey
ALTER TABLE `DetailSetor` DROP FOREIGN KEY `DetailSetor_kategoriSampahId_fkey`;

-- DropForeignKey
ALTER TABLE `DetailSetor` DROP FOREIGN KEY `DetailSetor_setorSampahId_fkey`;

-- DropForeignKey
ALTER TABLE `Hadiah` DROP FOREIGN KEY `Hadiah_appMakerId_fkey`;

-- DropForeignKey
ALTER TABLE `KategoriSampah` DROP FOREIGN KEY `KategoriSampah_appMakerId_fkey`;

-- DropForeignKey
ALTER TABLE `Nasabah` DROP FOREIGN KEY `Nasabah_appMakerId_fkey`;

-- DropForeignKey
ALTER TABLE `Nasabah` DROP FOREIGN KEY `Nasabah_userId_fkey`;

-- DropForeignKey
ALTER TABLE `PenukaranPoin` DROP FOREIGN KEY `PenukaranPoin_appMakerId_fkey`;

-- DropForeignKey
ALTER TABLE `PenukaranPoin` DROP FOREIGN KEY `PenukaranPoin_hadiahId_fkey`;

-- DropForeignKey
ALTER TABLE `PenukaranPoin` DROP FOREIGN KEY `PenukaranPoin_nasabahId_fkey`;

-- DropForeignKey
ALTER TABLE `SetorSampah` DROP FOREIGN KEY `SetorSampah_appMakerId_fkey`;

-- DropForeignKey
ALTER TABLE `SetorSampah` DROP FOREIGN KEY `SetorSampah_nasabahId_fkey`;

-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_appMakerId_fkey`;

-- AlterTable
ALTER TABLE `AdminBank` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `appMakerId` INTEGER NOT NULL,
    MODIFY `userId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `AppMaker` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `DetailSetor` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `setorSampahId` INTEGER NOT NULL,
    MODIFY `kategoriSampahId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Hadiah` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `appMakerId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `KategoriSampah` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `appMakerId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Nasabah` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `appMakerId` INTEGER NOT NULL,
    MODIFY `userId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `PenukaranPoin` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `appMakerId` INTEGER NOT NULL,
    MODIFY `nasabahId` INTEGER NOT NULL,
    MODIFY `hadiahId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `SetorSampah` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `appMakerId` INTEGER NOT NULL,
    MODIFY `nasabahId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `appMakerId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `AdminBank`
    ADD CONSTRAINT `AdminBank_appMakerId_fkey`
    FOREIGN KEY (`appMakerId`) REFERENCES `AppMaker`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdminBank`
    ADD CONSTRAINT `AdminBank_userId_fkey`
    FOREIGN KEY (`userId`) REFERENCES `User`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailSetor`
    ADD CONSTRAINT `DetailSetor_kategoriSampahId_fkey`
    FOREIGN KEY (`kategoriSampahId`) REFERENCES `KategoriSampah`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailSetor`
    ADD CONSTRAINT `DetailSetor_setorSampahId_fkey`
    FOREIGN KEY (`setorSampahId`) REFERENCES `SetorSampah`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Hadiah`
    ADD CONSTRAINT `Hadiah_appMakerId_fkey`
    FOREIGN KEY (`appMakerId`) REFERENCES `AppMaker`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KategoriSampah`
    ADD CONSTRAINT `KategoriSampah_appMakerId_fkey`
    FOREIGN KEY (`appMakerId`) REFERENCES `AppMaker`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Nasabah`
    ADD CONSTRAINT `Nasabah_appMakerId_fkey`
    FOREIGN KEY (`appMakerId`) REFERENCES `AppMaker`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Nasabah`
    ADD CONSTRAINT `Nasabah_userId_fkey`
    FOREIGN KEY (`userId`) REFERENCES `User`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PenukaranPoin`
    ADD CONSTRAINT `PenukaranPoin_appMakerId_fkey`
    FOREIGN KEY (`appMakerId`) REFERENCES `AppMaker`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PenukaranPoin`
    ADD CONSTRAINT `PenukaranPoin_hadiahId_fkey`
    FOREIGN KEY (`hadiahId`) REFERENCES `Hadiah`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PenukaranPoin`
    ADD CONSTRAINT `PenukaranPoin_nasabahId_fkey`
    FOREIGN KEY (`nasabahId`) REFERENCES `Nasabah`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SetorSampah`
    ADD CONSTRAINT `SetorSampah_appMakerId_fkey`
    FOREIGN KEY (`appMakerId`) REFERENCES `AppMaker`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SetorSampah`
    ADD CONSTRAINT `SetorSampah_nasabahId_fkey`
    FOREIGN KEY (`nasabahId`) REFERENCES `Nasabah`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User`
    ADD CONSTRAINT `User_appMakerId_fkey`
    FOREIGN KEY (`appMakerId`) REFERENCES `AppMaker`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;