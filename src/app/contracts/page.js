'use client';

import { useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';

const STATUS_STYLE = {
  PENDING  : 'bg-[rgba(201,168,76,0.12)] text-[#C9A84C] border border-[rgba(201,168,76,0.3)]',
  ACTIVE   : 'bg-[rgba(76,175,118,0.15)] text-[#4CAF76] border border-[rgba(76,175,118,0.3)]',
  EXECUTED : 'bg-[rgba(76,120,175,0.15)] text-[#6B9FE4] border border-[rgba(76,120,175,0.3)]',
  CANCELLED: 'bg-[rgba(207,74,74,0.15)]  text-[#CF4A4A] border border-[rgba(207,74,74,0.3)]',
};

const TYPE_LABEL = {
  MEDICAL_PAYMENT: 'Medical Payment',
  INSURANCE_CLAIM: 'Insurance Claim',
};

const INPUT_CLASS = "w-full rounded-lg border border-[#2a2a2a] bg-black px-4 py-3 text-sm font-light text-white outline-none transition-colors focus:border-[#C9A84C]";
const LABEL_CLASS = "mb-2 block font-mono text-[0.6rem] tracking-[0.2em] uppercase text-[#7a7570]";

// ─────────────────────────────────────────
// COMPONENT: CONTRACT CARD
// ─────────────────────────────────────────
function ContractCard({ contract, onAction }) {
  const fields = [
    { label: 'Dari',    value: contract.from  },
    { label: 'Ke',      value: contract.to    },
    { label: 'Jumlah',  value: `${contract.amount?.toLocaleString()} MED` },
    { label: 'Dibuat',  value: new Date(contract.createdAt).toLocaleString('id-ID') },
  ];

  return (
    <div className="mb-4 overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#111] transition-colors hover:border-[#C9A84C]">

      <div className="flex items-center justify-between border-b border-[#2a2a2a] px-6 py-4">
        <div>
          <span className="font-mono text-[0.65rem] tracking-widest uppercase text-[#C9A84C]">
            {TYPE_LABEL[contract.type]}
          </span>
          <div className="mt-0.5 font-mono text-[0.58rem] text-[#7a7570]">ID: {contract.id}</div>
        </div>
        <span className={`rounded-full px-3 py-0.5 text-[0.62rem] tracking-wider uppercase ${STATUS_STYLE[contract.status]}`}>
          {contract.status}
        </span>
      </div>

      <div className="p-6">
        <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {fields.map(f => (
            <div key={f.label}>
              <div className="mb-1 font-mono text-[0.56rem] tracking-widest uppercase text-[#7a7570]">{f.label}</div>
              <div className="break-all text-xs font-light text-white">{f.value}</div>
            </div>
          ))}
        </div>

        <div className="mb-5 rounded-lg border border-[#2a2a2a] bg-black px-4 py-3">
          <div className="mb-1 font-mono text-[0.56rem] tracking-widest uppercase text-[#7a7570]">Keterangan</div>
          <div className="text-xs font-light text-white">{contract.note}</div>
        </div>

        <div className="mb-5">
          <div className="mb-1 font-mono text-[0.56rem] tracking-widest uppercase text-[#7a7570]">Contract Hash</div>
          <div className="break-all font-mono text-[0.62rem] text-[#E8C97A]">{contract.hash}</div>
        </div>

        <div className="mb-5">
          <div className="mb-2 font-mono text-[0.56rem] tracking-widest uppercase text-[#7a7570]">Execution Log</div>
          <div className="space-y-1">
            {contract.log.map((entry, i) => (
              <div key={i} className="font-mono text-[0.6rem] text-[#7a7570]">{entry}</div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          {contract.status === 'PENDING' && (
            <>
              <button onClick={() => onAction('ACTIVATE', contract.id)}
                className="rounded-lg border border-[#4CAF76] px-4 py-2 text-[0.65rem] tracking-widest uppercase text-[#4CAF76] transition-all hover:bg-[rgba(76,175,118,0.1)]">
                Aktifkan
              </button>
              <button onClick={() => onAction('CANCEL', contract.id)}
                className="rounded-lg border border-[#CF4A4A] px-4 py-2 text-[0.65rem] tracking-widest uppercase text-[#CF4A4A] transition-all hover:bg-[rgba(207,74,74,0.1)]">
                Batalkan
              </button>
            </>
          )}
          {contract.status === 'ACTIVE' && (
            <>
              <button onClick={() => onAction('EXECUTE', contract.id)}
                className="rounded-lg bg-[#C9A84C] px-4 py-2 text-[0.65rem] font-medium tracking-widest uppercase text-black transition-all hover:bg-[#E8C97A]">
                Eksekusi
              </button>
              <button onClick={() => onAction('CANCEL', contract.id)}
                className="rounded-lg border border-[#CF4A4A] px-4 py-2 text-[0.65rem] tracking-widest uppercase text-[#CF4A4A] transition-all hover:bg-[rgba(207,74,74,0.1)]">
                Batalkan
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// COMPONENT: CREATE FORM
// ─────────────────────────────────────────
function CreateForm({ onCreated }) {
  const [form, setForm] = useState({
    type       : 'MEDICAL_PAYMENT',
    from       : 'MED-HOSPITAL-001',
    to         : 'MED-PATIENT-001',
    amount     : '',
    patientName: '',
    diagnosis  : '',
    testResult : 'Abnormal',
  });
  const [notify, setNotify] = useState(null);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleCreate = async () => {
    const action = form.type === 'MEDICAL_PAYMENT' ? 'CREATE_MEDICAL' : 'CREATE_INSURANCE';
    const res    = await fetch('/api/contracts', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ action, ...form, amount: parseInt(form.amount) }),
    });
    const data = await res.json();
    if (data.id) {
      onCreated();
    } else {
      setNotify(data.message);
    }
  };

  return (
    <div className="rounded-xl border border-[#2a2a2a] bg-[#111]">
      <div className="border-b border-[#2a2a2a] px-6 py-4">
        <span className="font-mono text-[0.65rem] tracking-widest uppercase text-[#7a7570]">
          Buat Smart Contract Baru
        </span>
      </div>
      <div className="grid grid-cols-2 gap-6 p-6">

        <div className="col-span-2">
          <label className={LABEL_CLASS}>Tipe Kontrak</label>
          <div className="flex gap-3">
            {[
              { value: 'MEDICAL_PAYMENT', label: '⬡ Medical Payment' },
              { value: 'INSURANCE_CLAIM', label: '◈ Insurance Claim' },
            ].map(opt => (
              <button key={opt.value} onClick={() => set('type', opt.value)}
                className={`flex-1 rounded-lg border py-3 text-xs tracking-widest uppercase transition-all ${
                  form.type === opt.value
                    ? 'border-[#C9A84C] bg-[rgba(201,168,76,0.1)] text-[#C9A84C]'
                    : 'border-[#2a2a2a] text-[#7a7570] hover:border-[#C9A84C]'
                }`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={LABEL_CLASS}>Dari Wallet</label>
          <select className={INPUT_CLASS} value={form.from} onChange={e => set('from', e.target.value)}>
            <option value="MED-HOSPITAL-001">Rumah Sakit Utama</option>
            <option value="MED-PATIENT-001">Pasien Wallet</option>
          </select>
        </div>

        <div>
          <label className={LABEL_CLASS}>Ke Wallet</label>
          <select className={INPUT_CLASS} value={form.to} onChange={e => set('to', e.target.value)}>
            <option value="MED-PATIENT-001">Pasien Wallet</option>
            <option value="MED-HOSPITAL-001">Rumah Sakit Utama</option>
          </select>
        </div>

        <div>
          <label className={LABEL_CLASS}>Jumlah MED</label>
          <input type="number" className={INPUT_CLASS} placeholder="500"
            value={form.amount} onChange={e => set('amount', e.target.value)} />
        </div>

        <div>
          <label className={LABEL_CLASS}>Nama Pasien</label>
          <input type="text" className={INPUT_CLASS} placeholder="John Doe"
            value={form.patientName} onChange={e => set('patientName', e.target.value)} />
        </div>

        {form.type === 'MEDICAL_PAYMENT' ? (
          <div className="col-span-2">
            <label className={LABEL_CLASS}>Diagnosis</label>
            <input type="text" className={INPUT_CLASS} placeholder="Diabetes, Asthma, dll"
              value={form.diagnosis} onChange={e => set('diagnosis', e.target.value)} />
          </div>
        ) : (
          <div className="col-span-2">
            <label className={LABEL_CLASS}>Hasil Test</label>
            <select className={INPUT_CLASS} value={form.testResult} onChange={e => set('testResult', e.target.value)}>
              <option value="Abnormal">Abnormal</option>
              <option value="Inconclusive">Inconclusive</option>
              <option value="Normal">Normal</option>
            </select>
          </div>
        )}

        {notify && (
          <div className="col-span-2 rounded-lg bg-[rgba(207,74,74,0.1)] px-4 py-3 text-xs text-[#CF4A4A]">
            ✕ {notify}
          </div>
        )}

        <div className="col-span-2">
          <button onClick={handleCreate}
            className="w-full rounded-lg bg-[#C9A84C] py-3.5 text-xs font-medium tracking-widest uppercase text-black transition-all hover:bg-[#E8C97A]">
            Buat Smart Contract →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────
export default function ContractsPage() {
  const [contracts, setContracts] = useState([]);
  const [tab, setTab]             = useState('LIST');
  const [notify, setNotify]       = useState(null);

  const fetchContracts = () =>
    fetch('/api/contracts')
      .then(r => r.json())
      .then(d => setContracts(d.contracts || []));

  useEffect(() => { fetchContracts(); }, []);

  const showNotify = (msg, success) => {
    setNotify({ msg, success });
    setTimeout(() => setNotify(null), 3000);
  };

  const handleAction = async (action, id) => {
    const res  = await fetch('/api/contracts', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ action, id }),
    });
    const data = await res.json();
    showNotify(data.message, data.success);
    fetchContracts();
  };

  const tabs = [
    { key: 'LIST',   label: `Semua Kontrak (${contracts.length})` },
    { key: 'CREATE', label: '+ Buat Kontrak Baru'                 },
  ];

  return (
    <div className="animate-fadeup">
      <PageHeader
        eyebrow="Blockchain Automation"
        title="Smart"
        highlight="Contract"
        subtitle="Kontrak otomatis pembayaran dan klaim asuransi berbasis blockchain."
      />

      {notify && (
        <div className={`mb-6 rounded-lg px-5 py-3 text-sm font-light ${
          notify.success
            ? 'bg-[rgba(76,175,118,0.1)] text-[#4CAF76]'
            : 'bg-[rgba(207,74,74,0.1)] text-[#CF4A4A]'
        }`}>
          {notify.success ? '✓' : '✕'} {notify.msg}
        </div>
      )}

      <div className="mb-8 flex gap-2">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`rounded-lg px-5 py-2.5 text-xs tracking-widest uppercase transition-all ${
              tab === t.key
                ? 'bg-[#C9A84C] font-medium text-black'
                : 'border border-[#2a2a2a] text-[#7a7570] hover:border-[#C9A84C] hover:text-[#C9A84C]'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'LIST' && (
        contracts.length === 0 ? (
          <div className="rounded-xl border border-[#2a2a2a] bg-[#111] px-8 py-16 text-center">
            <div className="mb-3 text-3xl">◈</div>
            <div className="font-cormorant text-2xl font-light text-[#7a7570]">Belum ada kontrak</div>
            <p className="mt-2 text-xs text-[#7a7570]">Buat kontrak baru untuk memulai.</p>
            <button onClick={() => setTab('CREATE')}
              className="mt-6 rounded-lg bg-[#C9A84C] px-6 py-2.5 text-xs font-medium tracking-widest uppercase text-black hover:bg-[#E8C97A]">
              Buat Kontrak →
            </button>
          </div>
        ) : (
          contracts.map(c => (
            <ContractCard key={c.id} contract={c} onAction={handleAction} />
          ))
        )
      )}

      {tab === 'CREATE' && (
        <CreateForm onCreated={() => { setTab('LIST'); fetchContracts(); }} />
      )}
    </div>
  );
}