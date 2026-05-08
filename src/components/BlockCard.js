export default function BlockCard({ block }) {
  return (
    <div className="mb-4 overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#111] transition-colors hover:border-[#C9A84C]">
      <div className="flex items-center justify-between border-b border-[#2a2a2a] px-6 py-4">
        <span className="font-cormorant text-2xl font-light text-[#C9A84C]">
          #{String(block.index).padStart(3, '0')}
        </span>
        <span className="font-mono text-[0.62rem] tracking-wider text-[#7a7570]">
          {block.hash.substring(0, 20)}...{block.hash.slice(-8)}
        </span>
      </div>
      <div className="p-6">
        <div className="mb-4 grid grid-cols-2 gap-4">
          {[
            { label: 'Timestamp',     value: block.timestamp,    mono: false },
            { label: 'Nonce',         value: block.nonce,        mono: true  },
            { label: 'Hash',          value: block.hash,         mono: true  },
            { label: 'Previous Hash', value: block.previousHash, mono: true  },
          ].map(item => (
            <div key={item.label}>
              <div className="mb-1 font-mono text-[0.58rem] tracking-[0.15em] uppercase text-[#7a7570]">
                {item.label}
              </div>
              <div className={`break-all text-xs ${item.mono ? 'font-mono text-[#E8C97A]' : 'text-white'}`}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
        <div>
          <div className="mb-2 font-mono text-[0.58rem] tracking-[0.15em] uppercase text-[#7a7570]">
            Data
          </div>
          <pre className="overflow-x-auto rounded-lg border border-[#2a2a2a] bg-black p-4 font-mono text-[0.65rem] text-[#E8C97A]">
            {JSON.stringify(block.data, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}