import PageHeader from '@/components/PageHeader';
import StatCard from '@/components/StatCard';
import Link from 'next/link';
import prisma from '@/lib/prisma';

const menuItems = [
  { href: '/dashboard',  icon: '◈', title: 'Analytics',      desc: 'Visualisasi data & statistik medis'   },
  { href: '/blocks',     icon: '⬡', title: 'View Blocks',    desc: 'Seluruh blok dalam rantai blockchain' },
  { href: '/patients',   icon: '◈', title: 'Patient Records',desc: 'Data rekam medis pasien'              },
  { href: '/validate',   icon: '◉', title: 'Validate Chain', desc: 'Verifikasi integritas blockchain'     },
  { href: '/wallet',     icon: '◈', title: 'MED Wallet',     desc: 'Dompet digital token MED'             },
  { href: '/payment',    icon: '⬡', title: 'MED Payment',    desc: 'Pembayaran berbasis Coinbase MED'     },
  { href: '/contracts',  icon: '◉', title: 'Smart Contract', desc: 'Kontrak otomatis berbasis blockchain' },
];

export default async function HomePage() {
  const total = await prisma.patient.count();

  return (
    <div className="animate-fadeup">
      <PageHeader
        eyebrow="Medical Blockchain System"
        title="Medi"
        highlight="Chain"
        subtitle="Sistem manajemen data medis berbasis blockchain dengan token MED terintegrasi."
      />

      <div className="mb-4 grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-[#2a2a2a] overflow-hidden rounded-xl border border-[#2a2a2a]">
        <StatCard label="Total Blocks"    value={total + 1} desc="Termasuk genesis block" />
        <StatCard label="Pasien Tercatat" value={total}     desc="Data di blockchain"     />
        <StatCard label="Difficulty"      value="2"         desc="Proof of Work"          />
        <StatCard label="Token"           value="MED"       desc="MedCoin currency"       />
      </div>

      {/* Status — full width di bawah */}
      <div className="mb-8 overflow-hidden rounded-xl border border-[#2a2a2a]">
        <StatCard
          label="Status Chain"
          value="Valid"
          desc="Integritas blockchain terjamin"
          valueColor="#4CAF76"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {menuItems.map(item => (
          <Link key={item.href} href={item.href}
            className="group relative overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#111] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C9A84C] hover:bg-[#181818]">
            <span className="mb-3 block text-2xl">{item.icon}</span>
            <div className="mb-1 text-xs font-medium tracking-widest uppercase text-white">{item.title}</div>
            <div className="text-xs font-light text-[#7a7570]">{item.desc}</div>
            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#C9A84C] transition-all duration-300 group-hover:w-full" />
          </Link>
        ))}
      </div>
    </div>
  );
}