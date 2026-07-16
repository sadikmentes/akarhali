import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PricesManager } from "@/components/admin/prices-manager";
import { CategoriesManager } from "@/components/admin/categories-manager";
import { priceService, categoryService } from "@/services/price.service";
import { serviceService } from "@/services/service.service";

export const metadata = { title: "Fiyatlar" };

export default async function AdminPricesPage() {
  const [prices, services, categories] = await Promise.all([
    priceService.list(),
    serviceService.list(),
    categoryService.list(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Fiyat Yönetimi</h1>
        <p className="text-muted-foreground">Fiyatları ve kategorileri yönetin.</p>
      </div>

      <Tabs defaultValue="prices">
        <TabsList>
          <TabsTrigger value="prices">Fiyatlar</TabsTrigger>
          <TabsTrigger value="categories">Kategoriler</TabsTrigger>
        </TabsList>
        <TabsContent value="prices" className="mt-4">
          <PricesManager prices={prices} services={services} categories={categories} />
        </TabsContent>
        <TabsContent value="categories" className="mt-4">
          <CategoriesManager categories={categories} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
