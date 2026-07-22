"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Tag,
  Megaphone,
  Image as ImageIcon,
  Images,
  Sparkles,
  HelpCircle,
  FileText,
  Phone,
  KeyRound,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ADMIN_NAV_ITEMS } from "@/constants/site";
import { Button } from "@/components/ui/button";

const ICONS: Record<string, typeof LayoutDashboard> = {
  LayoutDashboard,
  Tag,
  Megaphone,
  Image: ImageIcon,
  Images,
  Sparkles,
  HelpCircle,
  FileText,
  Phone,
  KeyRound,
};

const LABELS: Record<string, string> = {
  dashboard: "Panel",
  slider: "Ana Sayfa Slaytı",
  prices: "Fiyatlar",
  campaigns: "Kampanyalar",
  gallery: "Galeri",
  services: "Hizmetler",
  faq: "S.S.S.",
  content: "İçerik Yönetimi",
  contact: "İletişim Bilgileri",
  users: "Hesap & Şifre",
};

export function AdminSidebar({
  userName,
  onNavigate,
}: {
  userName?: string | null;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-background">
      <div className="flex h-16 items-center gap-3 border-b px-4">
        <Image
          src="/akar-logo.png"
          alt="Akar Halı"
          width={120}
          height={52}
          className="h-10 w-auto object-contain"
        />
        <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
          Admin
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <nav className="space-y-1 p-3">
          {ADMIN_NAV_ITEMS.map((item) => {
            const Icon = ICONS[item.icon];
            const isActive =
              item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/70 hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon className="size-4.5" />
                {LABELS[item.key]}
              </Link>
            );
          })}
        </nav>

        <div className="mx-3 mt-2 space-y-1 border-t pt-3">
          {userName && (
            <p className="mb-1 truncate px-3 text-xs text-muted-foreground">{userName}</p>
          )}
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/" onClick={onNavigate}>
              <ArrowLeft className="size-4" />
              Siteye Dön
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={async () => {
              onNavigate?.();
              // redirect:false + relative yönlendirme: sunucunun ürettiği mutlak
              // URL (AUTH_URL) yerine cihazın açtığı adreste kalınır, böylece
              // telefondan/LAN IP'sinden girişte localhost'a atıp hata vermez.
              await signOut({ redirect: false });
              window.location.href = "/";
            }}
          >
            <LogOut className="size-4" />
            Çıkış Yap
          </Button>
        </div>
      </div>
    </aside>
  );
}
