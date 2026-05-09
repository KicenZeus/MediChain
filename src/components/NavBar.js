'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

const links = [
  { href: '/',           label: 'Home'      },
  { href: '/dashboard',  label: 'Dashboard' },
  { href: '/blocks',     label: 'Blocks'    },
  { href: '/patients',   label: 'Patients'  },
  { href: '/validate',   label: 'Validate'  },
  { href: '/wallet',     label: 'Wallet'    },
  { href: '/payment',    label: 'Payment'   },
  { href: '/contracts',  label: 'Contracts' },
];

export default function NavBar() {
  const pathname          = usePathname();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-[#2a2a2a] bg-[rgba(8,8,8,0.95)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">

        {/* Brand */}
        <Link href="/" className="font-cormorant text-lg font-semibold tracking-widest text-[#C9A84C] uppercase">
          ⬡ MediChain
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(link => (
            <Link key={link.href} href={link.href}
              className={`rounded px-3 py-1.5 text-xs font-light tracking-widest uppercase transition-all duration-200
                ${pathname === link.href
                  ? 'border border-[#2a2a2a] bg-[rgba(201,168,76,0.12)] text-[#C9A84C]'
                  : 'text-[#7a7570] hover:border hover:border-[#2a2a2a] hover:bg-[rgba(201,168,76,0.08)] hover:text-[#C9A84C]'
                }`}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <>
              <div className="text-right">
                <div className="text-xs font-light text-white">{session.user.name}</div>
                <div className="font-mono text-[0.58rem] tracking-wider uppercase text-[#C9A84C]">
                  {session.user.role}
                </div>
              </div>
              <button onClick={() => signOut({ callbackUrl: '/login' })}
                className="rounded-lg border border-[#2a2a2a] px-3 py-1.5 text-xs tracking-widest uppercase text-[#7a7570] transition-all hover:border-[#CF4A4A] hover:text-[#CF4A4A]">
                Keluar
              </button>
            </>
          ) : (
            <Link href="/login"
              className="rounded-lg bg-[#C9A84C] px-4 py-1.5 text-xs font-medium tracking-widest uppercase text-black transition-all hover:bg-[#E8C97A]">
              Masuk
            </Link>
          )}
        </div>

        {/* Mobile Right */}
        <div className="flex md:hidden items-center gap-3">
          {session && (
            <div className="font-mono text-[0.58rem] tracking-wider uppercase text-[#C9A84C]">
              {session.user.role}
            </div>
          )}
          {/* Hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col gap-1.5 p-2">
            <span className={`block h-0.5 w-5 bg-[#C9A84C] transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 w-5 bg-[#C9A84C] transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-5 bg-[#C9A84C] transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#2a2a2a] bg-[#080808] px-4 py-4">
          <div className="flex flex-col gap-1">
            {links.map(link => (
              <Link key={link.href} href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-lg px-4 py-3 text-sm font-light tracking-widest uppercase transition-all
                  ${pathname === link.href
                    ? 'bg-[rgba(201,168,76,0.12)] text-[#C9A84C]'
                    : 'text-[#7a7570] hover:bg-[rgba(201,168,76,0.08)] hover:text-[#C9A84C]'
                  }`}>
                {link.label}
              </Link>
            ))}
            <div className="mt-3 border-t border-[#2a2a2a] pt-3">
              {session ? (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-light text-white">{session.user.name}</div>
                    <div className="font-mono text-[0.58rem] tracking-wider uppercase text-[#C9A84C]">{session.user.role}</div>
                  </div>
                  <button onClick={() => signOut({ callbackUrl: '/login' })}
                    className="rounded-lg border border-[#CF4A4A] px-3 py-1.5 text-xs text-[#CF4A4A]">
                    Keluar
                  </button>
                </div>
              ) : (
                <Link href="/login" onClick={() => setMenuOpen(false)}
                  className="block w-full rounded-lg bg-[#C9A84C] py-3 text-center text-xs font-medium tracking-widest uppercase text-black">
                  Masuk
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}