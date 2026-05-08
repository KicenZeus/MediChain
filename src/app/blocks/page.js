import PageHeader from '@/components/PageHeader';
import BlockCard from '@/components/BlockCard';
import prisma from '@/lib/prisma';

export default async function BlocksPage() {
  const patients = await prisma.patient.findMany({ orderBy: { blockIndex: 'asc' } });

  const genesis = {
    index: 0, timestamp: new Date().toISOString(),
    data: { info: 'Genesis Block — MediChain Rumah Sakit' },
    hash: '0000000000000000000000000000000000000000000000000000000000000000',
    previousHash: '0', nonce: 0,
  };

  const blocks = [genesis, ...patients.map(p => ({
    index: p.blockIndex,
    timestamp: p.timestamp.toISOString(), // ← tambah .toISOString()
    data: {
      nama: p.nama, umur: p.umur, jenisKelamin: p.jenisKelamin,
      golonganDarah: p.golonganDarah, kondisiMedis: p.kondisiMedis,
      tanggalMasuk: p.tanggalMasuk, tanggalKeluar: p.tanggalKeluar,
      dokter: p.dokter, rumahSakit: p.rumahSakit, obat: p.obat,
      hasilTest: p.hasilTest, biaya: p.biaya, asuransi: p.asuransi,
    },
    hash: p.blockHash, previousHash: p.prevHash, nonce: p.nonce,
  }))];

  return (
    <div className="animate-fadeup">
      <PageHeader
        eyebrow="Blockchain Explorer"
        title="All"
        highlight="Blocks"
        subtitle={`${blocks.length} blok ditemukan dalam rantai.`}
      />
      {blocks.map(block => <BlockCard key={block.index} block={block} />)}
    </div>
  );
}