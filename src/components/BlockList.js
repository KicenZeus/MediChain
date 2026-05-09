'use client';
import { useState, useMemo } from 'react';
import BlockCard from './BlockCard';

const SORT_OPTIONS = [
  { value: 'index-asc',  label: 'Index ↑' },
  { value: 'index-desc', label: 'Index ↓' },
  { value: 'nonce-asc',  label: 'Nonce ↑' },
  { value: 'nonce-desc', label: 'Nonce ↓' },
];

export default function BlockList({ blocks }) {
  const [search, setSearch]   = useState('');
  const [sort, setSort]       = useState('index-asc');
  const [filter, setFilter]   = useState('all');

  const filtered = useMemo(() => {
    let result = [...blocks];

    // ── Filter by type ──
    if (filter === 'genesis') {
      result = result.filter(b => b.index === 0);
    } else if (filter === 'patient') {
      result = result.filter(b => b.index !== 0);
    }

    // ── Search by hash, nama, kondisi ──
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(b =>
        b.hash.toLowerCase().includes(q) ||
        b.previousHash.toLowerCase().includes(q) ||
        JSON.stringify(b.data).toLowerCase().includes(q)
      );
    }

    // ── Sort ──
    const [key, dir] = sort.split('-');
    result.sort((a, b) => {
      const valA = key === 'index' ? a.index : a.nonce;
      const valB = key === 'index' ? b.index : b.nonce;
      return dir === 'asc' ? valA - valB : valB - valA;
    });

    return result;
  }, [blocks, search, sort, filter]);

  const inputClass  = "rounded-lg border border-[#2a2a2a] bg-[#111] px-4 py-2.5 text-sm font-light text-white outline-none transition-colors focus:border-[#C9A84C]";
  const activeBtn   = "border-[#C9A84C] bg-[rgba(201,168,76,0.1)] text-[#C9A84C]";
  const inactiveBtn = "border-[#2a2a2a] text-[#7a7570] hover:border-[#C9A84C] hover:text-[#C9A84C]";

  return (
    <div>
      {/* ── Toolbar ── */}
      <div className="mb-6 flex flex-wrap items-center gap-3">

        {/* Search */}
        <input
          type="text"
          placeholder="Cari hash, nama pasien, kondisi..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={`${inputClass} flex-1 min-w-[200px]`}
        />

        {/* Filter Buttons */}
        <div className="flex gap-2">
          {[
            { value: 'all',     label: 'Semua'   },
            { value: 'genesis', label: 'Genesis' },
            { value: 'patient', label: 'Pasien'  },
          ].map(f => (
            <button key={f.value} onClick={() => setFilter(f.value)}
              className={`rounded-lg border px-4 py-2 text-xs tracking-widest uppercase transition-all ${filter === f.value ? activeBtn : inactiveBtn}`}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select value={sort} onChange={e => setSort(e.target.value)}
          className={inputClass}>
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* ── Result Count ── */}
      <div className="mb-4 font-mono text-[0.62rem] tracking-widest uppercase text-[#7a7570]">
        Menampilkan {filtered.length} dari {blocks.length} blok
      </div>

      {/* ── Block List ── */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-[#2a2a2a] bg-[#111] py-16 text-center">
          <div className="mb-2 text-3xl">⬡</div>
          <div className="font-cormorant text-2xl font-light text-[#7a7570]">Blok tidak ditemukan</div>
          <p className="mt-2 text-xs text-[#7a7570]">Coba ubah filter atau kata kunci pencarian.</p>
        </div>
      ) : (
        filtered.map(block => (
          <BlockCard key={`${block.index}-${block.hash}`} block={block} />
        ))
      )}
    </div>
  );
}