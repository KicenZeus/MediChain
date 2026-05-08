import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { blockIndex: 'asc' },
    });

    const genesis = {
      index       : 0,
      timestamp   : new Date().toISOString(),
      data        : { info: 'Genesis Block — MediChain Rumah Sakit' },
      hash        : '0000000000000000000000000000000000000000000000000000000000000000',
      previousHash: '0',
      nonce       : 0,
    };

    const blocks = [genesis, ...patients.map(p => ({
      index       : p.blockIndex,
      timestamp   : p.timestamp,
      data        : {
        nama         : p.nama,
        umur         : p.umur,
        jenisKelamin : p.jenisKelamin,
        golonganDarah: p.golonganDarah,
        kondisiMedis : p.kondisiMedis,
        tanggalMasuk : p.tanggalMasuk,
        tanggalKeluar: p.tanggalKeluar,
        dokter       : p.dokter,
        rumahSakit   : p.rumahSakit,
        obat         : p.obat,
        hasilTest    : p.hasilTest,
        biaya        : p.biaya,
        asuransi     : p.asuransi,
      },
      hash        : p.blockHash,
      previousHash: p.prevHash,
      nonce       : p.nonce,
    }))];

    return Response.json({
      blocks,
      total  : blocks.length,
      isValid: true,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}