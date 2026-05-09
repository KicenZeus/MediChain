import PageHeader from '@/components/PageHeader';
import DashboardCharts from '@/components/DashboardCharts';
import prisma from '@/lib/prisma';

export default async function DashboardPage() {
  const patients = await prisma.patient.findMany();

  // ── Hitung semua analytics di server ──
  const kondisiCount = patients.reduce((acc, p) => {
    acc[p.kondisiMedis] = (acc[p.kondisiMedis] || 0) + 1;
    return acc;
  }, {});

  const hasilCount = patients.reduce((acc, p) => {
    acc[p.hasilTest] = (acc[p.hasilTest] || 0) + 1;
    return acc;
  }, {});

  const genderCount = patients.reduce((acc, p) => {
    acc[p.jenisKelamin] = (acc[p.jenisKelamin] || 0) + 1;
    return acc;
  }, {});

  const asuransiCount = patients.reduce((acc, p) => {
    acc[p.asuransi] = (acc[p.asuransi] || 0) + 1;
    return acc;
  }, {});

  const biayaPerKondisi = {};
  patients.forEach(p => {
    if (!biayaPerKondisi[p.kondisiMedis])
      biayaPerKondisi[p.kondisiMedis] = { total: 0, count: 0 };
    biayaPerKondisi[p.kondisiMedis].total += parseFloat(p.biaya || 0);
    biayaPerKondisi[p.kondisiMedis].count += 1;
  });

  const data = {
    kondisiChart : Object.entries(kondisiCount).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value),
    hasilChart   : Object.entries(hasilCount).map(([name, value]) => ({ name, value })),
    genderChart  : Object.entries(genderCount).map(([name, value]) => ({ name, value })),
    asuransiChart: Object.entries(asuransiCount).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value).slice(0, 6),
    biayaChart   : Object.entries(biayaPerKondisi).map(([name, { total, count }]) => ({ name, value: Math.round(total / count) })).sort((a,b) => b.value - a.value),
  };

  const totalBiaya = patients.reduce((a, p) => a + parseFloat(p.biaya || 0), 0);
  const avgBiaya   = patients.length ? totalBiaya / patients.length : 0;
  const avgUmur    = patients.length ? patients.reduce((a, p) => a + parseInt(p.umur || 0), 0) / patients.length : 0;

  const summaryStats = [
    { label: 'Total Pasien',   value: patients.length,               color: '#C9A84C' },
    { label: 'Rata-rata Umur', value: `${Math.round(avgUmur)} thn`,  color: '#6B9FE4' },
    { label: 'Avg Biaya',      value: `$${Math.round(avgBiaya / 1000)}k`, color: '#4CAF76' },
    { label: 'Total Biaya',    value: `$${Math.round(totalBiaya / 1000)}k`, color: '#E4A06B' },
  ];

  return (
    <div className="animate-fadeup">
      <PageHeader
        eyebrow="Analytics & Insights"
        title="Med"
        highlight="Analytics"
        subtitle="Visualisasi data medis dan statistik blockchain MediChain."
      />

      {/* Summary Stats */}
      <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-[#2a2a2a] overflow-hidden rounded-xl border border-[#2a2a2a]">
        {summaryStats.map(s => (
          <div key={s.label} className="bg-[#111] p-7 hover:bg-[#181818] transition-colors">
            <div className="mb-2 font-mono text-[0.6rem] tracking-[0.2em] uppercase text-[#7a7570]">{s.label}</div>
            <div className="font-cormorant text-4xl font-light leading-none" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <DashboardCharts data={data} />
    </div>
  );
}