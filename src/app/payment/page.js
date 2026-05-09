'use client';
import { useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';

export default function PaymentPage() {
  const [wallets, setWallets]   = useState({});
  const [form, setForm]         = useState({ from: '', to: '', amount: '', note: '' });
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    fetch('/api/wallet').then(r => r.json()).then(d => {
      setWallets(d.wallets);
      const keys = Object.keys(d.wallets);
      setForm(f => ({ ...f, from: keys[0] || '', to: keys[1] || '' }));
    });
  }, []);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);
    const res  = await fetch('/api/payment', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ ...form, amount: parseInt(form.amount) }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
    if (data.success) {
      fetch('/api/wallet').then(r => r.json()).then(d => setWallets(d.wallets));
    }
  };

  const walletOptions = Object.entries(wallets).map(([addr, w]) => (
    <option key={addr} value={addr}>{w.name} ({w.balance?.toLocaleString()} MED)</option>
  ));

  const inputClass = "w-full rounded-lg border border-[#2a2a2a] bg-black px-4 py-3.5 text-sm font-light text-white outline-none transition-colors focus:border-[#C9A84C]";
  const labelClass = "mb-2 block font-mono text-[0.6rem] tracking-[0.2em] uppercase text-[#7a7570]";

  return (
    <div className="animate-fadeup">
      <PageHeader
        eyebrow="Coinbase · Token MED"
        title="MED"
        highlight="Payment"
        subtitle="Kirim token MED antar wallet dalam ekosistem rumah sakit."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Transfer Form */}
        <div className="rounded-xl border border-[#2a2a2a] bg-[#111]">
          <div className="border-b border-[#2a2a2a] px-6 py-4">
            <span className="font-mono text-[0.65rem] tracking-widest uppercase text-[#7a7570]">Transfer MED</span>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className={labelClass}>Dari Wallet</label>
              <select name="from" value={form.from} onChange={handleChange} className={inputClass}>
                {walletOptions}
              </select>
            </div>
            <div>
              <label className={labelClass}>Ke Wallet</label>
              <select name="to" value={form.to} onChange={handleChange} className={inputClass}>
                {walletOptions}
              </select>
            </div>
            <div>
              <label className={labelClass}>Jumlah MED</label>
              <input name="amount" type="number" value={form.amount} onChange={handleChange}
                placeholder="100" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Keterangan</label>
              <input name="note" type="text" value={form.note} onChange={handleChange}
                placeholder="Biaya rawat inap" className={inputClass} />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full rounded-lg bg-[#C9A84C] py-3.5 text-xs font-medium tracking-widest uppercase text-black transition-all hover:bg-[#E8C97A] disabled:opacity-50"
            >
              {loading ? 'Memproses...' : 'Kirim MED →'}
            </button>

            {result && (
              <div className={`rounded-lg px-4 py-3 text-xs font-light ${result.success ? 'bg-[rgba(76,175,118,0.1)] text-[#4CAF76]' : 'bg-[rgba(207,74,74,0.1)] text-[#CF4A4A]'}`}>
                {result.success ? '✓' : '✕'} {result.message}
              </div>
            )}
          </div>
        </div>

        {/* Token Info */}
        <div className="rounded-xl border border-[#2a2a2a] bg-[#111]">
          <div className="border-b border-[#2a2a2a] px-6 py-4">
            <span className="font-mono text-[0.65rem] tracking-widest uppercase text-[#7a7570]">Info Token MED</span>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <div className="mb-1 font-mono text-[0.56rem] tracking-widest uppercase text-[#7a7570]">Token Name</div>
              <div className="font-cormorant text-4xl font-light text-[#C9A84C]">MedCoin</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { label: 'Symbol',   value: 'MED'                  },
                { label: 'Network',  value: 'MedChain'             },
                { label: 'Standard', value: 'Coinbase Compatible'  },
                { label: 'Total Supply', value: `${Object.values(wallets).reduce((a, w) => a + (w.balance || 0), 0).toLocaleString()} MED` },
              ].map(item => (
                <div key={item.label}>
                  <div className="mb-1 font-mono text-[0.56rem] tracking-widest uppercase text-[#7a7570]">{item.label}</div>
                  <div className="text-sm font-light text-white">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}