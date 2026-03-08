import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeScript } from '@/components/ui/ThemeScript';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'SyncPad — Real-Time Collaborative Editor',
  description: 'Edit documents together with instant sync and version history.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen font-sans antialiased">
        <ThemeScript />
        {children}
      </body>
    </html>
  );
}
