import { PricesManager } from "@/components/admin/prices-manager";
import { priceService } from "@/services/price.service";
import { serviceService } from "@/services/service.service";

export const metadata = { title: "Fiyatlar" };

export default async function AdminPricesPage() {
  const [prices, services] = await Promise.all([
    priceService.list(),
    serviceService.list(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Fiyat Yönetimi</h1>
        <p className="text-muted-foreground">Fiyatları yönetin.</p>
      </div>

      <PricesManager prices={prices} services={services} />
    </div>
  );
}
