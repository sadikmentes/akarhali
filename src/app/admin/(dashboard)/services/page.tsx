import { ServicesManager } from "@/components/admin/services-manager";
import { serviceService } from "@/services/service.service";

export const metadata = { title: "Hizmetler" };

export default async function AdminServicesPage() {
  const services = await serviceService.list();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Hizmet Yönetimi</h1>
        <p className="text-muted-foreground">Sunulan hizmetleri yönetin.</p>
      </div>
      <ServicesManager services={services} />
    </div>
  );
}
