import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { Plus_Jakarta_Sans, Sora } from "next/font/google";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FloatingButtons } from "@/components/layout/floating-buttons";
import { Toaster } from "sonner";
import { settingsService } from "@/services/settings.service";
import { SITE_CONFIG } from "@/constants/site";
import "../globals.css";

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});
const heading = Sora({
  variable: "--font-heading",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

// Content (settings, prices, campaigns, gallery, etc.) is admin-editable in the
// database, so pages are rendered dynamically rather than statically at build time.
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  await params;
  const seo = await settingsService.getSeo().catch(() => null);

  const title =
    seo?.siteTitleTr ??
    "Akar Halı | Profesyonel Halı, Koltuk ve Perde Yıkama";
  const description =
    seo?.siteDescriptionTr ??
    "Akar Halı ile evinizin ve işyerinizin halı, koltuk, perde temizliğini uzman ekibimize emanet edin.";

  return {
    metadataBase: new URL(SITE_CONFIG.url),
    title: { default: title, template: `%s | ${SITE_CONFIG.name}` },
    description,
    keywords: seo?.keywordsTr?.split(",").map((k) => k.trim()),
    alternates: {
      canonical: "/",
      languages: { tr: "/" },
    },
    openGraph: {
      title,
      description,
      url: SITE_CONFIG.url,
      siteName: SITE_CONFIG.name,
      locale: "tr_TR",
      type: "website",
      images: seo?.ogImage ? [{ url: seo.ogImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: seo?.twitterHandle ?? undefined,
      images: seo?.ogImage ? [seo.ogImage] : [],
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const [contact, social] = await Promise.all([
    settingsService.getContact().catch(() => null),
    settingsService.getSocial().catch(() => null),
  ]);

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${sans.variable} ${heading.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <NextIntlClientProvider>
            <Navbar phone={contact?.phone} />
            <main className="flex-1">{children}</main>
            <Footer />
            <FloatingButtons
              whatsapp={social?.whatsapp}
              phone={contact?.phone}
              instagram={social?.instagram}
              facebook={social?.facebook}
            />
            <Toaster richColors position="top-center" />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
