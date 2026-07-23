import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { PriceListView, type PriceGroup } from "@/components/price-list/price-list-view";
import { priceService } from "@/services/price.service";
import { serviceService } from "@/services/service.service";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("priceList");
  return { title: t("title"), description: t("subtitle") };
}

export default async function PriceListPage() {
  const t = await getTranslations("priceList");
  const [prices, services] = await Promise.all([
    priceService.listActive(),
    serviceService.listActive(),
  ]);

  const mainServices = services
    .filter((service) => !service.parentId)
    .sort((a, b) => a.order - b.order);

  // Group active prices under their (main) service, preserving service order
  // and dropping services that have no prices to show.
  const groups: PriceGroup[] = mainServices
    .map((service) => ({
      id: service.id,
      slug: service.slug,
      name: service.titleTr,
      rows: prices
        .filter((price) => {
          const priceService = price.service;
          const topLevelId = priceService.parentId ?? priceService.id;
          return topLevelId === service.id;
        })
        .map((price) => ({
          id: price.id,
          name: price.nameTr,
          unit: price.unit,
          basePrice: Number(price.basePrice),
          discountPrice: price.discountPrice != null ? Number(price.discountPrice) : null,
          isCampaignActive: price.isCampaignActive,
        })),
    }))
    .filter((group) => group.rows.length > 0);

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <Container>
        {groups.length === 0 ? (
          <p className="text-center text-muted-foreground">Henüz fiyat eklenmedi.</p>
        ) : (
          <>
            <PriceListView groups={groups} />
            <p className="mt-10 text-center text-sm text-muted-foreground">
              * Fiyatlarımız bilgilendirme amaçlıdır ve ürün durumuna göre değişiklik
              gösterebilir. Güncel fiyat için bizimle iletişime geçebilirsiniz.
            </p>
          </>
        )}
      </Container>
    </>
  );
}
