import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Toaster from '@/components/ui/toaster';
import Nav from '@/components/navigation/nav';
import { ThemeProvider } from '@/components/providers/theme-provider';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Drip | E-commerce',
  description: 'Drip is a modern e-commerce platform',
  icons: [
    {
      rel: 'icon',
      type: 'image/webp',
      sizes: '32x32',
      url: '/assets/images/logo.webp',
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} `}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem={true}
          storageKey='theme'
        >
          <div className='mx-auto max-w-7xl px-6 antialiased md:px-12'>
            <Nav />
            <Toaster />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
