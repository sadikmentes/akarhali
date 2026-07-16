import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { Features } from "@/components/home/features";
import { Process } from "@/components/home/process";
import { Stats } from "@/components/home/stats";
import { CampaignSection } from "@/components/home/campaign-section";
import { MapSection } from "@/components/home/map-section";
import { settingsService } from "@/services/settings.service";
import { campaignService } from "@/services/campaign.service";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("home");
  return { title: t("hero.title") };
}

export default async function HomePage() {
  const [site, social, campaigns] = await Promise.all([
    settingsService.getSite(),
    settingsService.getSocial(),
    campaignService.listActive(),
  ]);

  const heroTitle = site.heroTitleTr ?? "Profesyonel Halı Yıkama Hizmeti";
  const heroSubtitle =
    site.heroSubtitleTr ?? "Halı, koltuk ve perde yıkamada güvenilir çözüm ortağınız.";

  return (
    <>
      <Hero title={heroTitle} subtitle={heroSubtitle} whatsapp={social.whatsapp} />
      <Features />
      <Process />
      <Stats
        years={site.statsYearsExp ?? 10}
        clients={site.statsHappyClients ?? 5000}
        projects={site.statsProjectsDone ?? 12000}
        team={site.statsTeamMembers ?? 20}
      />
      <CampaignSection campaigns={campaigns} />
      <MapSection
        embedUrl={site.mapEmbedUrl}
        latitude={site.mapLatitude}
        longitude={site.mapLongitude}
      />
    </>
  );
}
