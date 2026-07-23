import Link from "next/link";
import {
  Tag,
  Megaphone,
  Image as ImageIcon,
  Sparkles,
  Plus,
  Images,
  ArrowUpRight,
} from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const metadata = { title: "Panel" };

const QUICK_ACTIONS = [
  { href: "/admin/prices", label: "Yeni Fiyat Ekle", icon: Tag },
  { href: "/admin/campaigns", label: "Yeni Kampanya Ekle", icon: Megaphone },
  { href: "/admin/gallery", label: "Galeriye Görsel Ekle", icon: Images },
  { href: "/admin/services", label: "Yeni Hizmet Ekle", icon: Sparkles },
];

const GREETING_FORMATTER = new Intl.DateTimeFormat("tr-TR", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

export default async function AdminDashboardPage() {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0];

  const [priceCount, campaignCount, galleryCount, serviceCount] = await Promise.all([
    prisma.price.count(),
    prisma.campaign.count({ where: { isActive: true } }),
    prisma.galleryImage.count(),
    prisma.service.count({ where: { isActive: true } }),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">
            {firstName ? `Hoş geldin, ${firstName}` : "Panele Hoş Geldiniz"}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {GREETING_FORMATTER.format(new Date())} · Sitenizin genel durumuna göz atın.
          </p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 self-start rounded-full border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          Siteyi Görüntüle
          <ArrowUpRight className="size-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Toplam Fiyat" value={priceCount} icon={Tag} tone="emerald" />
        <StatCard label="Aktif Kampanya" value={campaignCount} icon={Megaphone} tone="amber" />
        <StatCard label="Galeri Görseli" value={galleryCount} icon={ImageIcon} tone="sky" />
        <StatCard label="Aktif Hizmet" value={serviceCount} icon={Sparkles} tone="violet" />
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Hızlı İşlemler
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_ACTIONS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-3 rounded-2xl border bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="size-5" />
              </div>
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{label}</span>
              <Plus className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
