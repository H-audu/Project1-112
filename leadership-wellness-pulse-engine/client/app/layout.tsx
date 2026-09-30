import './globals.css';
import Link from 'next/link';

export const metadata = { title: 'Leadership & Wellness Pulse Engine', description: 'Short-cycle leadership wellness surveillance' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>
    <header className="header"><strong>Leadership & Wellness Pulse Engine</strong><nav><Link href="/dashboard">Dashboard</Link><Link href="/survey">Pulse Survey</Link><Link href="/login">Login</Link></nav></header>
    {children}
  </body></html>;
}
