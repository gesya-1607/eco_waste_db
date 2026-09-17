-- CreateTable
CREATE TABLE `AppMaker` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `namaSiswa` VARCHAR(191) NOT NULL,
    `kelas` VARCHAR(191) NOT NULL,
    `namaApp` VARCHAR(191) NOT NULL,
    `appKey` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `AppMaker_email_key`(`email`),
    UNIQUE INDEX `AppMaker_appKey_key`(`appKey`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `appMakerId` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('NASABAH', 'ADMIN') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `User_appMakerId_idx`(`appMakerId`),
    UNIQUE INDEX `User_appMakerId_username_key`(`appMakerId`, `username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Nasabah` (
    `id` VARCHAR(191) NOT NULL,
    `appMakerId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `namaNasabah` VARCHAR(191) NOT NULL,
    `alamat` VARCHAR(191) NOT NULL,
    `telp` VARCHAR(191) NOT NULL,
    `tanggalLahir` DATETIME(3) NULL,
    `saldoPoin` INTEGER NOT NULL DEFAULT 0,
    `foto` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Nasabah_userId_key`(`userId`),
    INDEX `Nasabah_appMakerId_idx`(`appMakerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdminBank` (
    `id` VARCHAR(191) NOT NULL,
    `appMakerId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `namaUnit` VARCHAR(191) NOT NULL,
    `namaPengelola` VARCHAR(191) NOT NULL,
    `telp` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `AdminBank_userId_key`(`userId`),
    INDEX `AdminBank_appMakerId_idx`(`appMakerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KategoriSampah` (
    `id` VARCHAR(191) NOT NULL,
    `appMakerId` VARCHAR(191) NOT NULL,
    `namaKategori` VARCHAR(191) NOT NULL,
    `hargaPerKg` INTEGER NOT NULL,
    `poinPerKg` INTEGER NOT NULL,
    `jenis` ENUM('plastik', 'kertas', 'logam', 'kaca') NOT NULL,
    `foto` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `KategoriSampah_appMakerId_idx`(`appMakerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SetorSampah` (
    `id` VARCHAR(191) NOT NULL,
    `appMakerId` VARCHAR(191) NOT NULL,
    `nasabahId` VARCHAR(191) NOT NULL,
    `kodeSetor` VARCHAR(191) NOT NULL,
    `tanggal` DATETIME(3) NOT NULL,
    `catatan` VARCHAR(191) NOT NULL,
    `status` ENUM('menunggu_konfirmasi', 'diverifikasi', 'ditolak', 'selesai') NOT NULL DEFAULT 'menunggu_konfirmasi',
    `totalBeratKg` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `totalPoin` INTEGER NOT NULL DEFAULT 0,
    `totalBayar` INTEGER NOT NULL DEFAULT 0,
    `catatanAdmin` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SetorSampah_kodeSetor_key`(`kodeSetor`),
    INDEX `SetorSampah_appMakerId_idx`(`appMakerId`),
    INDEX `SetorSampah_nasabahId_idx`(`nasabahId`),
    INDEX `SetorSampah_status_idx`(`status`),
    INDEX `SetorSampah_tanggal_idx`(`tanggal`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DetailSetor` (
    `id` VARCHAR(191) NOT NULL,
    `setorSampahId` VARCHAR(191) NOT NULL,
    `kategoriSampahId` VARCHAR(191) NOT NULL,
    `beratKgEstimasi` DECIMAL(10, 2) NOT NULL,
    `beratKgReal` DECIMAL(10, 2) NULL,
    `hargaPerKg` INTEGER NOT NULL,
    `poinPerKg` INTEGER NOT NULL,
    `subtotalBayar` INTEGER NOT NULL DEFAULT 0,
    `subtotalPoin` INTEGER NOT NULL DEFAULT 0,

    INDEX `DetailSetor_setorSampahId_idx`(`setorSampahId`),
    INDEX `DetailSetor_kategoriSampahId_idx`(`kategoriSampahId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Hadiah` (
    `id` VARCHAR(191) NOT NULL,
    `appMakerId` VARCHAR(191) NOT NULL,
    `namaHadiah` VARCHAR(191) NOT NULL,
    `poinDibutuhkan` INTEGER NOT NULL,
    `stok` INTEGER NOT NULL,
    `foto` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Hadiah_appMakerId_idx`(`appMakerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PenukaranPoin` (
    `id` VARCHAR(191) NOT NULL,
    `appMakerId` VARCHAR(191) NOT NULL,
    `nasabahId` VARCHAR(191) NOT NULL,
    `hadiahId` VARCHAR(191) NOT NULL,
    `kodePenukaran` VARCHAR(191) NOT NULL,
    `tanggal` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `poinTerpakai` INTEGER NOT NULL,
    `status` ENUM('diproses', 'selesai', 'ditolak') NOT NULL DEFAULT 'diproses',

    UNIQUE INDEX `PenukaranPoin_kodePenukaran_key`(`kodePenukaran`),
    INDEX `PenukaranPoin_appMakerId_idx`(`appMakerId`),
    INDEX `PenukaranPoin_nasabahId_idx`(`nasabahId`),
    INDEX `PenukaranPoin_hadiahId_idx`(`hadiahId`),
    INDEX `PenukaranPoin_tanggal_idx`(`tanggal`),
    INDEX `PenukaranPoin_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_appMakerId_fkey` FOREIGN KEY (`appMakerId`) REFERENCES `AppMaker`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Nasabah` ADD CONSTRAINT `Nasabah_appMakerId_fkey` FOREIGN KEY (`appMakerId`) REFERENCES `AppMaker`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Nasabah` ADD CONSTRAINT `Nasabah_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdminBank` ADD CONSTRAINT `AdminBank_appMakerId_fkey` FOREIGN KEY (`appMakerId`) REFERENCES `AppMaker`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdminBank` ADD CONSTRAINT `AdminBank_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KategoriSampah` ADD CONSTRAINT `KategoriSampah_appMakerId_fkey` FOREIGN KEY (`appMakerId`) REFERENCES `AppMaker`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SetorSampah` ADD CONSTRAINT `SetorSampah_appMakerId_fkey` FOREIGN KEY (`appMakerId`) REFERENCES `AppMaker`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SetorSampah` ADD CONSTRAINT `SetorSampah_nasabahId_fkey` FOREIGN KEY (`nasabahId`) REFERENCES `Nasabah`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailSetor` ADD CONSTRAINT `DetailSetor_setorSampahId_fkey` FOREIGN KEY (`setorSampahId`) REFERENCES `SetorSampah`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailSetor` ADD CONSTRAINT `DetailSetor_kategoriSampahId_fkey` FOREIGN KEY (`kategoriSampahId`) REFERENCES `KategoriSampah`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Hadiah` ADD CONSTRAINT `Hadiah_appMakerId_fkey` FOREIGN KEY (`appMakerId`) REFERENCES `AppMaker`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PenukaranPoin` ADD CONSTRAINT `PenukaranPoin_appMakerId_fkey` FOREIGN KEY (`appMakerId`) REFERENCES `AppMaker`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PenukaranPoin` ADD CONSTRAINT `PenukaranPoin_nasabahId_fkey` FOREIGN KEY (`nasabahId`) REFERENCES `Nasabah`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PenukaranPoin` ADD CONSTRAINT `PenukaranPoin_hadiahId_fkey` FOREIGN KEY (`hadiahId`) REFERENCES `Hadiah`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
