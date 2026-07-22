import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { PriceListView, type PriceGroup } from "@/components/price-list/price-list-view";
import { priceService, categoryService } from "@/services/price.service";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("priceList");
  return { title: t("title"), description: t("subtitle") };
}

export default async function PriceListPage() {
  const t = await getTranslations("priceList");
  const [prices, categories] = await Promise.all([
    priceService.listActive(),
    categoryService.list(),
  ]);

  // Group active prices under their category, preserving category order and
  // dropping categories that have no prices to show.
  const groups: PriceGroup[] = categories
    .map((category) => ({
      id: category.id,
      slug: category.slug,
      name: category.nameTr,
      rows: prices
        .filter((price) => price.categoryId === category.id)
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
