import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { campaignService } from "@/services/campaign.service";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("campaignsPage");
  return { title: t("title"), description: t("subtitle") };
}

export default async function CampaignsPage() {
  const t = await getTranslations("campaignsPage");
  const campaigns = await campaignService.listActive();
  const dateLocale = tr;

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <Container>
        {campaigns.length === 0 ? (
          <p className="text-center text-muted-foreground">{t("noCampaigns")}</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((c) => {
              const title = c.titleTr;
              const description = c.descriptionTr;
              return (
                <div
                  key={c.id}
                  className="overflow-hidden rounded-2xl border bg-card shadow-sm"
                >
                  <div className="relative aspect-4/3">
                    <Image
                      src={c.image}
                      alt={title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                    <span className="absolute top-3 right-3 rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white">
                      %{c.discountPercent} {t("discount")}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="mb-2 text-lg font-semibold">{title}</h3>
                    {description && (
                      <p className="mb-3 text-sm text-muted-foreground">{description}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {t("validUntil")}: {format(c.endDate, "d MMMM yyyy", { locale: dateLocale })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Container>
    </>
  );
}
