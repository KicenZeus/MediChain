import { Cormorant_Garamond, DM_Mono, Outfit } from 'next/font/google';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import SessionProvider from '@/components/SessionProvider';
import NavBar from '@/components/NavBar';
import './globals.css';
import NotificationToast from '@/components/NotificationToast';


const cormorant = Cormorant_Garamond({
  subsets : ['latin'],
  weight  : ['300', '400', '600'],
  variable: '--font-cormorant',
});

const dmMono = DM_Mono({
  subsets : ['latin'],
  weight  : ['300', '400'],
  variable: '--font-dm-mono',
});

const outfit = Outfit({
  subsets : ['latin'],
  weight  : ['200', '300', '400', '500'],
  variable: '--font-outfit',
});

export const metadata = {
  title      : 'MediChain — Blockchain Rumah Sakit',
  description: 'Sistem manajemen data medis berbasis blockchain',
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="id" className={`${cormorant.variable} ${dmMono.variable} ${outfit.variable}`}>
      <body className="min-h-screen bg-[#080808] text-[#F5F0E8] antialiased">
        <SessionProvider session={session}>
          <NavBar />
          <main className="mx-auto max-w-6xl px-4 md:px-8 py-8 md:py-16">
            {children}
          </main>
          <footer className="mx-auto max-w-6xl border-t border-[#2a2a2a] px-4 md:px-8 py-6">
            <div className="flex justify-between">
              <span className="font-cormorant text-sm tracking-widest text-[#7a7570]">
                MediChain — Blockchain Rumah Sakit
              </span>
              <span className="font-mono text-[0.6rem] tracking-widest text-[#2a2a2a]">
                Kresenzius
              </span>
            </div>
          </footer>
          <NotificationToast />
        </SessionProvider>
      </body>
    </html>
  );
}