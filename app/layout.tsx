import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import BrandMark from '@/components/BrandMark';
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Ciallade — Be Yourself, Reinvent Always',
    template: '%s | Ciallade',
  },
  description:
    'Ciallade is a luxury Nigerian fashion brand. Geometric, warm luxury — clothes, caps, and accessories for those who define themselves.',
  keywords: ['Nigerian fashion', 'luxury fashion', 'Ciallade', 'African fashion', 'ready-to-wear'],
  openGraph: {
    title: 'Ciallade — Be Yourself, Reinvent Always',
    description: 'A luxury Nigerian fashion brand. Wear who you are. Wear it boldly.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className="antialiased font-body bg-dark-wood text-almond-cream">
        <main>{children}</main>
        <BrandMark />
      </body>
    </html>
  );
}
