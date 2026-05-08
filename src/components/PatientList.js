'use client';
import { useState } from 'react';

const badgeStyle = {
  Normal      : 'bg-[rgba(76,175,118,0.15)]  text-[#4CAF76] border border-[rgba(76,175,118,0.3)]',
  Abnormal    : 'bg-[rgba(207,74,74,0.15)]   text-[#CF4A4A] border border-[rgba(207,74,74,0.3)]',
  Inconclusive: 'bg-[rgba(201,168,76,0.12)]  text-[#C9A84C] border border-[rgba(201,168,76,0.3)]',
};

export default function PatientList({ patients }) {
  const [search, setSearch] = useState('');

  const filtered = patients.filter(p =>
    p.nama.toLowerCase().includes(search.toLowerCase()) ||
    p.kondisiMedis.toLowerCase().includes(search.toLowerCase()) ||
    p.dokter.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Cari nama pasien, kondisi, atau dokter..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full rounded-xl border border-[#2a2a2a] bg-[#111] px-5 py-4 text-sm font-light text-white outline-none transition-colors focus:border-[#C9A84C] placeholder:text-[#7a7570]"
        />
      </div>

      {/* Result Count */}
      <div className="mb-4 font-mono text-[0.62rem] tracking-widest uppercase text-[#7a7570]">
        Menampilkan {filtered.length} dari {patients.length} pasien
      </div>

      {/* Patient Cards */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-[#2a2a2a] bg-[#111] py-16 text-center">
          <div className="font-cormorant text-2xl font-light text-[#7a7570]">Pasien tidak ditemukan</div>
        </div>
      ) : (
        filtered.map((p, i) => (
          <div key={p.id}
            className="group relative mb-4 overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#111] p-7 transition-all duration-300 hover:translate-x-1 hover:border-[#C9A84C]"
            style={{ animationDelay: `${i * 0.03}s` }}>
            <div className="absolute left-0 top-0 h-full w-0.5 bg-[#C9A84C] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="font-cormorant mb-1 text-3xl font-light text-white">{p.nama}</div>
            <div className="mb-5 font-mono text-[0.6rem] tracking-[0.2em] uppercase text-[#C9A84C]">
              Patient · Block #{String(p.blockIndex).padStart(3, '0')}
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {[
                { label: 'Usia',        value: `${p.umur} tahun` },
                { label: 'Gender',      value: p.jenisKelamin    },
                { label: 'Gol. Darah',  value: p.golonganDarah   },
                { label: 'Kondisi',     value: p.kondisiMedis    },
                { label: 'Obat',        value: p.obat            },
                { label: 'Tgl Masuk',   value: p.tanggalMasuk    },
                { label: 'Tgl Keluar',  value: p.tanggalKeluar   },
                { label: 'Dokter',      value: p.dokter          },
                { label: 'Rumah Sakit', value: p.rumahSakit      },
                { label: 'Asuransi',    value: p.asuransi        },
              ].map(f => (
                <div key={f.label}>
                  <div className="mb-1 font-mono text-[0.56rem] tracking-[0.18em] uppercase text-[#7a7570]">{f.label}</div>
                  <div className="text-sm font-light text-white">{f.value}</div>
                </div>
              ))}
              <div>
                <div className="mb-1 font-mono text-[0.56rem] tracking-[0.18em] uppercase text-[#7a7570]">Hasil Test</div>
                <span className={`inline-block rounded-full px-3 py-0.5 text-[0.62rem] tracking-wider uppercase ${badgeStyle[p.hasilTest] ?? badgeStyle.Inconclusive}`}>
                  {p.hasilTest}
                </span>
              </div>
              <div>
                <div className="mb-1 font-mono text-[0.56rem] tracking-[0.18em] uppercase text-[#7a7570]">Biaya</div>
                <div className="text-sm font-light text-[#C9A84C]">
                  ${parseFloat(p.biaya || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}