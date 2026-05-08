export default function StatCard({ label, value, desc, valueColor }) {
  return (
    <div className="bg-[#111] p-7 transition-colors hover:bg-[#181818]">
      <div className="mb-2 font-mono text-[0.6rem] tracking-[0.2em] uppercase text-[#7a7570]">
        {label}
      </div>
      <div
        className="font-cormorant text-4xl font-light leading-none"
        style={{ color: valueColor || '#C9A84C' }}
      >
        {value}
      </div>
      {desc && (
        <div className="mt-2 text-xs font-light text-[#7a7570]">{desc}</div>
      )}
    </div>
  );
}