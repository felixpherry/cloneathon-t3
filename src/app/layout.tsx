import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { TRPCReactProvider } from '@/trpc/client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'T4 Chat',
  description: 'The best AI chat in the world.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TRPCReactProvider>
          {children}

          <ReactQueryDevtools initialIsOpen={false} />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
