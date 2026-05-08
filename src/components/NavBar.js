'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

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
  const pathname        = usePathname();
  const { data: session } = useSession();

  return (
    <nav className="sticky top-0 z-50 border-b border-[#2a2a2a] bg-[rgba(8,8,8,0.88)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-8">
        <Link href="/" className="font-cormorant text-lg font-semibold tracking-widest text-[#C9A84C] uppercase">
          ⬡ MediChain
        </Link>

        <div className="flex items-center gap-1">
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

        {/* User Info & Auth */}
        <div className="flex items-center gap-3">
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
      </div>
    </nav>
  );
}