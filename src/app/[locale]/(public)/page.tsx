import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { VideoSection } from "@/components/home/video-section";
import { Features } from "@/components/home/features";
import { Process } from "@/components/home/process";
import { Stats } from "@/components/home/stats";
import { CampaignSection } from "@/components/home/campaign-section";
import { MapSection } from "@/components/home/map-section";
import { settingsService } from "@/services/settings.service";
import { campaignService } from "@/services/campaign.service";
import { heroSlideService } from "@/services/hero-slide.service";
import { resolveFeatures, resolveProcess } from "@/constants/home-content";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("home");
  return { title: t("hero.title") };
}

export default async function HomePage() {
  const t = await getTranslations("home");
  const [site, social, contact, campaigns, heroSlides] = await Promise.all([
    settingsService.getSite(),
    settingsService.getSocial(),
    settingsService.getContact(),
    campaignService.listActive(),
    heroSlideService.listActive(),
  ]);

  const slides = heroSlides.map((s) => ({
    src: s.url,
    alt: s.titleTr ?? "Akar Halı",
  }));

  const heroTitle = site.heroTitleTr ?? "Profesyonel Halı Yıkama Hizmeti";
  const heroSubtitle =
    site.heroSubtitleTr ?? "Halı, koltuk ve perde yıkamada güvenilir çözüm ortağınız.";

  const features = resolveFeatures(site);
  const process = resolveProcess(site);

  return (
    <>
      <Hero
        title={heroTitle}
        subtitle={heroSubtitle}
        whatsapp={social.whatsapp}
        phone={contact.phone}
        slides={slides}
      />
      <VideoSection url={site.heroVideoUrl} title={t("video.title")} />
      <Features title={features.title} subtitle={features.subtitle} items={features.items} />
      <Process title={process.title} subtitle={process.subtitle} items={process.items} />
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
