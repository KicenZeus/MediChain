export default function PageHeader({ eyebrow, title, highlight, subtitle }) {
  return (
    <div className="mb-14">
      <div className="mb-4 flex items-center gap-3 font-mono text-[0.65rem] tracking-[0.25em] uppercase text-[#C9A84C]">
        <span className="block h-px w-6 bg-[#C9A84C]" />
        {eyebrow}
      </div>
      <h1 className="font-cormorant text-5xl font-light leading-tight text-white">
        {title} <span className="italic text-[#C9A84C]">{highlight}</span>
      </h1>
      {subtitle && (
        <p className="mt-3 max-w-md text-sm font-light tracking-wide text-[#7a7570]">
          {subtitle}
        </p>
      )}
      <div className="mt-6 h-px w-12 bg-gradient-to-r from-[#C9A84C] to-transparent" />
    </div>
  );
}