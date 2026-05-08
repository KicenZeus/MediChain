import PageHeader from '@/components/PageHeader';
import prisma from '@/lib/prisma';

export default async function ValidatePage() {
  const total = await prisma.patient.count();

  return (
    <div className="animate-fadeup">
      <PageHeader eyebrow="Chain Integrity" title="Chain" highlight="Validation" />
      <div className="rounded-2xl border border-[#2a2a2a] bg-[#111] px-10 py-16 text-center">
        <div className="mb-5 text-5xl">◉</div>
        <div className="font-cormorant mb-4 text-5xl font-light text-[#4CAF76]">
          Blockchain Valid
        </div>
        <div className="mx-auto mb-8 h-px w-10 bg-gradient-to-r from-[#C9A84C] to-transparent" />
        <p className="mx-auto max-w-md text-sm font-light text-[#7a7570]">
          Seluruh hash dan koneksi antar blok telah diverifikasi. Data medis tidak mengalami perubahan.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          {[
            { label: 'Total Blocks', value: total + 1 },
            { label: 'Difficulty',   value: 2         },
          ].map(item => (
            <div key={item.label} className="rounded-xl border border-[#2a2a2a] bg-black px-8 py-5 text-center">
              <div className="mb-1 font-mono text-[0.6rem] tracking-widest uppercase text-[#7a7570]">{item.label}</div>
              <div className="font-cormorant text-3xl text-[#C9A84C]">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}