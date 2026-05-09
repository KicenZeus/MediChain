import PageHeader from '@/components/PageHeader';
import Link from 'next/link';
import prisma from '@/lib/prisma';

export default async function WalletPage() {
  const wallets      = await prisma.wallet.findMany();
  const transactions = await prisma.transaction.findMany({
    orderBy: { createdAt: 'desc' },
    take   : 10,
  });

  const txList = transactions.map(tx => ({
    from  : tx.from,
    to    : tx.to,
    amount: tx.amount,
    note  : tx.note,
    time  : new Date(tx.createdAt).toLocaleTimeString('id-ID'),
  }));

  return (
    <div className="animate-fadeup">
      <PageHeader
        eyebrow="Token MED"
        title="MED"
        highlight="Wallet"
        subtitle="Dompet digital token MED untuk ekosistem rumah sakit."
      />

      {/* Wallet Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        {wallets.map(w => (
          <div key={w.address}
            className="relative overflow-hidden rounded-2xl border border-[rgba(201,168,76,0.3)] bg-gradient-to-br from-[#111] to-[#1a1508] p-10">
            <div className="absolute right-8 top-1/2 -translate-y-1/2 font-cormorant text-8xl font-light text-[rgba(201,168,76,0.05)] pointer-events-none">
              MED
            </div>
            <div className="mb-2 font-mono text-[0.6rem] tracking-[0.2em] uppercase text-[#C9A84C]">
              MED Balance
            </div>
            <div className="font-cormorant text-5xl font-light text-white leading-none">
              {w.balance.toLocaleString('en-US')}
              <span className="ml-2 text-xl text-[#C9A84C]">MED</span>
            </div>
            <div className="mt-3 text-sm font-light text-[#7a7570]">{w.name}</div>
            <div className="mt-1 font-mono text-[0.6rem] text-[#7a7570]">{w.address}</div>
          </div>
        ))}
      </div>

      {/* Transaction History */}
      <div className="mb-6 rounded-xl border border-[#2a2a2a] bg-[#111]">
        <div className="border-b border-[#2a2a2a] px-6 py-4">
          <span className="font-mono text-[0.65rem] tracking-widest uppercase text-[#7a7570]">
            Riwayat Transaksi
          </span>
        </div>
        <div className="p-6">
          {txList.length === 0 ? (
            <p className="text-xs font-light text-[#7a7570]">Belum ada transaksi.</p>
          ) : (
            txList.map((tx, i) => (
              <div key={i} className="flex items-center justify-between border-b border-[#2a2a2a] py-4 last:border-0">
                <div>
                  <div className="text-sm font-light text-white">{tx.from} → {tx.to}</div>
                  <div className="mt-0.5 text-xs text-[#7a7570]">{tx.note} · {tx.time}</div>
                </div>
                <div className="font-mono text-sm text-[#C9A84C]">−{tx.amount} MED</div>
              </div>
            ))
          )}
        </div>
      </div>

      <Link href="/payment"
        className="inline-block rounded-lg bg-[#C9A84C] px-8 py-3.5 text-xs font-medium tracking-widest uppercase text-black transition-all hover:bg-[#E8C97A] hover:-translate-y-0.5">
        Buat Transaksi MED →
      </Link>
    </div>
  );
}