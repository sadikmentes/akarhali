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
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-7 sm:grid-cols-2">
            {campaigns.map((c) => {
              const title = c.titleTr;
              const description = c.descriptionTr;
              return (
                <div
                  key={c.id}
                  className="flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm"
                >
                  <div className="relative aspect-[4/5] bg-muted">
                    <Image
                      src={c.image}
                      alt={title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain"
                    />
                    <span className="absolute top-3 right-3 rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white shadow">
                      %{c.discountPercent} {t("discount")}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="mb-2 text-lg font-semibold">{title}</h3>
                    {description && (
                      <p className="mb-3 whitespace-pre-line text-sm text-muted-foreground">
                        {description}
                      </p>
                    )}
                    <p className="mt-auto pt-2 text-xs text-muted-foreground">
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
