'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const GOLD    = '#C9A84C';
const GREEN   = '#4CAF76';
const RED     = '#CF4A4A';
const BLUE    = '#6B9FE4';
const PURPLE  = '#9B6BE4';
const COLORS  = [GOLD, GREEN, RED, BLUE, PURPLE, '#E4A06B'];

// ── Custom Tooltip ──
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[#2a2a2a] bg-[#111] px-4 py-3">
      <div className="mb-1 font-mono text-[0.6rem] tracking-widest uppercase text-[#7a7570]">{label}</div>
      <div className="font-cormorant text-xl text-[#C9A84C]">{payload[0].value}</div>
    </div>
  );
};

// ── Custom Pie Label ──
const renderPieLabel = ({ name, percent }) =>
  `${name} ${(percent * 100).toFixed(0)}%`;

// ── Chart Card Wrapper ──
function ChartCard({ title, children }) {
  return (
    <div className="rounded-xl border border-[#2a2a2a] bg-[#111] p-6">
      <div className="mb-6 font-mono text-[0.65rem] tracking-widest uppercase text-[#7a7570]">
        {title}
      </div>
      {children}
    </div>
  );
}

export default function DashboardCharts({ data }) {
  const { kondisiChart, hasilChart, genderChart, asuransiChart, biayaChart } = data;

  return (
    <div className="space-y-5">

      {/* Row 1 — Kondisi & Hasil Test */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Bar Chart — Kondisi Medis */}
        <ChartCard title="Kondisi Medis Terbanyak">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={kondisiChart} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis dataKey="name" tick={{ fill: '#7a7570', fontSize: 10 }} />
              <YAxis tick={{ fill: '#7a7570', fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill={GOLD} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Pie Chart — Hasil Test */}
        <ChartCard title="Distribusi Hasil Test">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={hasilChart}
                cx="50%" cy="50%"
                outerRadius={90}
                dataKey="value"
                label={renderPieLabel}
                labelLine={{ stroke: '#7a7570' }}
              >
                {hasilChart.map((_, i) => (
                  <Cell key={i} fill={[GREEN, RED, GOLD][i] || COLORS[i]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>

      {/* Row 2 — Gender & Asuransi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Pie Chart — Gender */}
        <ChartCard title="Distribusi Gender">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={genderChart}
                cx="50%" cy="50%"
                innerRadius={60}
                outerRadius={90}
                dataKey="value"
                label={renderPieLabel}
                labelLine={{ stroke: '#7a7570' }}
              >
                {genderChart.map((_, i) => (
                  <Cell key={i} fill={[BLUE, GOLD][i] || COLORS[i]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={val => (
                  <span style={{ color: '#F5F0E8', fontSize: '0.75rem' }}>{val}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Bar Chart — Asuransi */}
        <ChartCard title="Asuransi Terbanyak">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={asuransiChart} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis dataKey="name" tick={{ fill: '#7a7570', fontSize: 9 }} />
              <YAxis tick={{ fill: '#7a7570', fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill={BLUE} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>

      {/* Row 3 — Rata-rata Biaya */}
      <ChartCard title="Rata-rata Biaya per Kondisi (USD)">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={biayaChart} margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis dataKey="name" tick={{ fill: '#7a7570', fontSize: 10 }} />
            <YAxis tick={{ fill: '#7a7570', fontSize: 10 }}
              tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
            <Tooltip
              content={({ active, payload, label }) =>
                active && payload?.length ? (
                  <div className="rounded-lg border border-[#2a2a2a] bg-[#111] px-4 py-3">
                    <div className="font-mono text-[0.6rem] tracking-widest uppercase text-[#7a7570]">{label}</div>
                    <div className="font-cormorant text-xl text-[#C9A84C]">
                      ${payload[0].value.toLocaleString()}
                    </div>
                  </div>
                ) : null
              }
            />
            <Bar dataKey="value" fill={GREEN} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

    </div>
  );
}