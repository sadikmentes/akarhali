import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Sora } from "next/font/google";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { Toaster } from "sonner";
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

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Yönetim Paneli", template: "%s | Akar Halı Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="tr"
      suppressHydrationWarning
      className={`${sans.variable} ${heading.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-muted/20">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
