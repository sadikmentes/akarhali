import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { priceService } from "@/services/price.service";
import { serviceService } from "@/services/service.service";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("priceList");
  return { title: t("title"), description: t("subtitle") };
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function PriceListPage() {
  const t = await getTranslations("priceList");
  const [prices, services] = await Promise.all([
    priceService.listActive(),
    serviceService.listActive(),
  ]);

  const grouped = services
    .map((service) => ({
      service,
      prices: prices.filter((p) => p.serviceId === service.id),
    }))
    .filter((g) => g.prices.length > 0);

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <Container className="space-y-12">
        {grouped.map(({ service, prices: servicePrices }) => {
          const serviceTitle = service.titleTr;
          return (
            <div key={service.id}>
              <h2 className="mb-4 text-xl font-bold">{serviceTitle}</h2>
              <div className="overflow-hidden rounded-2xl border">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-4 font-semibold">Hizmet</th>
                      <th className="p-4 font-semibold">{t("unit")}</th>
                      <th className="p-4 font-semibold">{t("price")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {servicePrices.map((price) => {
                      const name = price.nameTr;
                      const unitLabel = price.unit === "M2" ? t("perM2") : t("perPiece");
                      const hasDiscount = price.isCampaignActive && price.discountPrice;
                      return (
                        <tr key={price.id} className="border-t">
                          <td className="p-4">{name}</td>
                          <td className="p-4 text-muted-foreground">{unitLabel}</td>
                          <td className="p-4">
                            {hasDiscount ? (
                              <span className="flex items-center gap-2">
                                <span className="text-muted-foreground line-through">
                                  {formatPrice(Number(price.basePrice))}
                                </span>
                                <span className="font-semibold text-primary">
                                  {formatPrice(Number(price.discountPrice))}
                                </span>
                                <Badge variant="destructive">{t("campaignPrice")}</Badge>
                              </span>
                            ) : (
                              <span className="font-semibold">
                                {formatPrice(Number(price.basePrice))}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
        {grouped.length === 0 && (
          <p className="text-center text-muted-foreground">Henüz fiyat eklenmedi.</p>
        )}
      </Container>
    </>
  );
}
