import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import BrandMark from '@/components/BrandMark';
import { fetchSiteContent } from '@/sanity/lib/fetch';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const DEFAULT_TITLE = 'Ciallade — Be Yourself, Reinvent Always';
const DEFAULT_DESCRIPTION =
  'Ciallade is a luxury Nigerian fashion brand. Geometric, warm luxury — clothes, caps, and accessories for those who define themselves.';

/**
 * Metadata is CMS-driven: the browser-tab (favicon) and Apple touch icons come
 * from Branding → Favicon / Apple icon, falling back to the master Logo; the
 * social/Open Graph image falls back to the logo too. When nothing is uploaded,
 * icons stay undefined so Next's built-in app/favicon.ico is used.
 */
export async function generateMetadata(): Promise<Metadata> {
  const site = await fetchSiteContent();
  const b = site?.branding;

  const title = b?.siteTitle?.trim() || DEFAULT_TITLE;
  const description = b?.siteDescription?.trim() || DEFAULT_DESCRIPTION;
  const favicon = b?.faviconUrl || b?.logoUrl;
  const apple = b?.appleIconUrl || b?.logoUrl;
  const og = b?.ogImageUrl || b?.logoUrl;

  const meta: Metadata = {
    metadataBase: new URL('https://ciallade-web.vercel.app'),
    title: { default: title, template: '%s | Ciallade' },
    description,
    keywords: ['Nigerian fashion', 'luxury fashion', 'Ciallade', 'African fashion', 'ready-to-wear'],
    openGraph: {
      title,
      description,
      type: 'website',
      images: og ? [{ url: og }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: og ? [og] : undefined,
    },
  };

  // Always emit an explicit icon. The built-in favicon now lives in /public
  // (not app/) so it no longer auto-injects a competing `sizes="any"` <link>
  // that overrode the CMS icon. Sanity favicon/logo wins; /favicon.ico is the
  // last-resort fallback.
  const iconUrl = favicon || '/favicon.ico';
  const iconType = iconUrl.includes('.ico') ? 'image/x-icon' : 'image/png';
  meta.icons = {
    icon: [{ url: iconUrl, type: iconType }],
    shortcut: [{ url: iconUrl }],
    apple: apple ? [{ url: apple }] : [{ url: iconUrl }],
  };

  return meta;
}

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
