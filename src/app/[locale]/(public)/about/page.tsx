import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Sparkles } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { settingsService } from "@/services/settings.service";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("about");
  return { title: t("title"), description: t("subtitle") };
}

export default async function AboutPage() {
  const t = await getTranslations("about");
  const site = await settingsService.getSite();

  const title = site.aboutTitleTr ?? t("title");
  const content = site.aboutContentTr ?? "İçerik henüz eklenmedi.";

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-2xl font-bold">{title}</h2>
          <p className="whitespace-pre-line text-muted-foreground leading-relaxed">{content}</p>
        </div>
        {site.aboutImage ? (
          // Kutuya sabit bir oran verilmiyor: yükseklik görselin kendi oranından
          // gelsin ki görsel hem kenardan kenara otursun hem de üstü/altı
          // kırpılmasın. (Sabit oran + object-cover kırpıyordu.)
          <div className="overflow-hidden rounded-2xl border shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={site.aboutImage}
              alt={title}
              className="block h-auto w-full"
            />
          </div>
        ) : (
          <div className="relative flex aspect-4/3 items-center justify-center overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/20 via-primary/5 to-transparent shadow-sm">
            <Sparkles className="size-16 text-primary/40" aria-hidden />
          </div>
        )}
      </Container>
    </>
  );
}
