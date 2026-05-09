'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      email   : form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError('Email atau password salah.');
    } else {
      router.push('/');
      router.refresh();
    }
  };

  const inputClass = "w-full rounded-lg border border-[#2a2a2a] bg-black px-4 py-3.5 text-sm font-light text-white outline-none transition-colors focus:border-[#C9A84C]";
  const labelClass = "mb-2 block font-mono text-[0.6rem] tracking-[0.2em] uppercase text-[#7a7570]";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#080808] px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="mb-10 text-center">
          <div className="mb-3 font-cormorant text-5xl font-light text-[#C9A84C]">
            ⬡ MediChain
          </div>
          <div className="font-mono text-[0.65rem] tracking-[0.25em] uppercase text-[#7a7570]">
            Blockchain Rumah Sakit
          </div>
          <div className="mx-auto mt-4 h-px w-12 bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#111] p-8">
          <div className="mb-6">
            <div className="font-mono text-[0.65rem] tracking-widest uppercase text-[#7a7570]">
              Masuk ke sistem
            </div>
          </div>

          {error && (
            <div className="mb-5 rounded-lg bg-[rgba(207,74,74,0.1)] px-4 py-3 text-xs text-[#CF4A4A]">
              ✕ {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" className={inputClass}
                placeholder="admin@medichain.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>
            <div>
              <label className={labelClass}>Password</label>
              <input type="password" className={inputClass}
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>

            <button onClick={handleSubmit} disabled={loading}
              className="w-full rounded-lg bg-[#C9A84C] py-4 text-xs font-medium tracking-widest uppercase text-black transition-all hover:bg-[#E8C97A] disabled:opacity-50 mt-2">
              {loading ? 'Masuk...' : 'Masuk →'}
            </button>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 rounded-lg border border-[#2a2a2a] bg-black p-4">
            <div className="mb-2 font-mono text-[0.58rem] tracking-widest uppercase text-[#7a7570]">
              Demo Credentials
            </div>
            <div className="space-y-1">
              {[
                { role: 'Admin',  email: 'admin@medichain.com',  pass: 'admin123'  },
                { role: 'Dokter', email: 'dokter@medichain.com', pass: 'dokter123' },
              ].map(c => (
                <div key={c.role}
                  className="flex cursor-pointer items-center justify-between rounded px-3 py-2 transition-colors hover:bg-[#181818]"
                  onClick={() => setForm({ email: c.email, password: c.pass })}>
                  <div>
                    <span className="text-xs font-light text-[#C9A84C]">{c.role}</span>
                    <span className="ml-2 font-mono text-[0.65rem] text-[#7a7570]">{c.email}</span>
                  </div>
                  <span className="font-mono text-[0.65rem] text-[#2a2a2a]">{c.pass}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center font-mono text-[0.6rem] tracking-widest uppercase text-[#2a2a2a]">
          MediChain
        </div>
      </div>
    </div>
  );
}