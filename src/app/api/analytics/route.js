import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const patients = await prisma.patient.findMany();

    // ── Kondisi Medis Terbanyak ──
    const kondisiCount = patients.reduce((acc, p) => {
      acc[p.kondisiMedis] = (acc[p.kondisiMedis] || 0) + 1;
      return acc;
    }, {});
    const kondisiChart = Object.entries(kondisiCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // ── Hasil Test Distribution ──
    const hasilCount = patients.reduce((acc, p) => {
      acc[p.hasilTest] = (acc[p.hasilTest] || 0) + 1;
      return acc;
    }, {});
    const hasilChart = Object.entries(hasilCount)
      .map(([name, value]) => ({ name, value }));

    // ── Gender Distribution ──
    const genderCount = patients.reduce((acc, p) => {
      acc[p.jenisKelamin] = (acc[p.jenisKelamin] || 0) + 1;
      return acc;
    }, {});
    const genderChart = Object.entries(genderCount)
      .map(([name, value]) => ({ name, value }));

    // ── Asuransi Terbanyak ──
    const asuransiCount = patients.reduce((acc, p) => {
      acc[p.asuransi] = (acc[p.asuransi] || 0) + 1;
      return acc;
    }, {});
    const asuransiChart = Object.entries(asuransiCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    // ── Rata-rata Biaya per Kondisi ──
    const biayaPerKondisi = {};
    patients.forEach(p => {
      if (!biayaPerKondisi[p.kondisiMedis])
        biayaPerKondisi[p.kondisiMedis] = { total: 0, count: 0 };
      biayaPerKondisi[p.kondisiMedis].total += parseFloat(p.biaya || 0);
      biayaPerKondisi[p.kondisiMedis].count += 1;
    });
    const biayaChart = Object.entries(biayaPerKondisi)
      .map(([name, { total, count }]) => ({
        name,
        value: Math.round(total / count),
      }))
      .sort((a, b) => b.value - a.value);

    // ── Summary Stats ──
    const totalBiaya    = patients.reduce((a, p) => a + parseFloat(p.biaya || 0), 0);
    const avgBiaya      = patients.length ? totalBiaya / patients.length : 0;
    const avgUmur       = patients.length
      ? patients.reduce((a, p) => a + parseInt(p.umur || 0), 0) / patients.length
      : 0;

    return Response.json({
      kondisiChart,
      hasilChart,
      genderChart,
      asuransiChart,
      biayaChart,
      summary: {
        totalPasien: patients.length,
        avgBiaya   : Math.round(avgBiaya),
        avgUmur    : Math.round(avgUmur),
        totalBiaya : Math.round(totalBiaya),
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}