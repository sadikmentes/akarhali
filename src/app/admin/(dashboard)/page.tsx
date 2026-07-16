import { Tag, Megaphone, Image as ImageIcon, Sparkles } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Panel" };

export default async function AdminDashboardPage() {
  const [priceCount, campaignCount, galleryCount, serviceCount] = await Promise.all([
    prisma.price.count(),
    prisma.campaign.count({ where: { isActive: true } }),
    prisma.galleryImage.count(),
    prisma.service.count({ where: { isActive: true } }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Panele Hoş Geldiniz</h1>
        <p className="text-muted-foreground">Sitenizin genel durumuna göz atın.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Toplam Fiyat" value={priceCount} icon={Tag} />
        <StatCard label="Aktif Kampanya" value={campaignCount} icon={Megaphone} />
        <StatCard label="Galeri Görseli" value={galleryCount} icon={ImageIcon} />
        <StatCard label="Aktif Hizmet" value={serviceCount} icon={Sparkles} />
      </div>
    </div>
  );
}
