import PageHeader from '@/components/PageHeader';
import BlockList from '@/components/BlockList';
import prisma from '@/lib/prisma';

export default async function BlocksPage() {
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
    timestamp   : p.timestamp.toISOString(),
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

  return (
    <div className="animate-fadeup">
      <PageHeader
        eyebrow="Blockchain Explorer"
        title="All"
        highlight="Blocks"
        subtitle={`${blocks.length} blok ditemukan dalam rantai.`}
      />

      {/* Stats */}
      <div className="mb-8 grid grid-cols-3 divide-x divide-[#2a2a2a] overflow-hidden rounded-xl border border-[#2a2a2a]">
        {[
          { label: 'Total Blocks',   value: blocks.length          },
          { label: 'Patient Blocks', value: blocks.length - 1      },
          { label: 'Genesis Block',  value: 1                      },
        ].map(s => (
          <div key={s.label} className="bg-[#111] p-6 text-center hover:bg-[#181818] transition-colors">
            <div className="font-cormorant text-3xl font-light text-[#C9A84C]">{s.value}</div>
            <div className="mt-1 font-mono text-[0.6rem] tracking-widest uppercase text-[#7a7570]">{s.label}</div>
          </div>
        ))}
      </div>

      <BlockList blocks={blocks} />
    </div>
  );
}