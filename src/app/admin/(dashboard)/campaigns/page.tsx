import { CampaignsManager } from "@/components/admin/campaigns-manager";
import { campaignService } from "@/services/campaign.service";

export const metadata = { title: "Kampanyalar" };

export default async function AdminCampaignsPage() {
  const campaigns = await campaignService.list();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Kampanya Yönetimi</h1>
        <p className="text-muted-foreground">Kampanyaları oluşturun, düzenleyin ve yönetin.</p>
      </div>
      <CampaignsManager campaigns={campaigns} />
    </div>
  );
}
