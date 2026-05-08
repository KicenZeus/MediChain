-- CreateTable
CREATE TABLE "Patient" (
    "id" SERIAL NOT NULL,
    "blockIndex" INTEGER NOT NULL,
    "nama" TEXT NOT NULL,
    "umur" TEXT NOT NULL,
    "jenisKelamin" TEXT NOT NULL,
    "golonganDarah" TEXT NOT NULL,
    "kondisiMedis" TEXT NOT NULL,
    "tanggalMasuk" TEXT NOT NULL,
    "tanggalKeluar" TEXT NOT NULL,
    "dokter" TEXT NOT NULL,
    "rumahSakit" TEXT NOT NULL,
    "obat" TEXT NOT NULL,
    "hasilTest" TEXT NOT NULL,
    "biaya" TEXT NOT NULL,
    "asuransi" TEXT NOT NULL,
    "blockHash" TEXT NOT NULL,
    "prevHash" TEXT NOT NULL,
    "nonce" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "note" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SmartContract" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "note" TEXT NOT NULL DEFAULT '',
    "conditions" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "hash" TEXT NOT NULL,
    "log" JSONB NOT NULL DEFAULT '[]',
    "executedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SmartContract_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Patient_blockIndex_key" ON "Patient"("blockIndex");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_address_key" ON "Wallet"("address");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_from_fkey" FOREIGN KEY ("from") REFERENCES "Wallet"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_to_fkey" FOREIGN KEY ("to") REFERENCES "Wallet"("address") ON DELETE RESTRICT ON UPDATE CASCADE;
