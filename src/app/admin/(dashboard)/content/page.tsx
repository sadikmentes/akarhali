import { SiteContentForm } from "@/components/admin/site-content-form";
import { settingsService } from "@/services/settings.service";

export const metadata = { title: "İçerik Yönetimi" };

export default async function AdminContentPage() {
  const site = await settingsService.getSite();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">İçerik Yönetimi</h1>
        <p className="text-muted-foreground">
          Anasayfa, hakkımızda ve istatistik metinlerini düzenleyin.
        </p>
      </div>
      <SiteContentForm site={site} />
    </div>
  );
}
