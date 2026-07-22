import type { SiteSettings } from "@/types";

// Default copy for the homepage "Neden Akar Halı?" (features) and "Çalışma
// Sürecimiz" (process) sections. These are used as fallbacks when the admin
// has not customised the text in SiteSettings, and as placeholders in the
// admin content form. Icons are fixed in the components (by position).

export const FEATURES_DEFAULTS = {
  title: "Neden Akar Halı?",
  subtitle: "Kalite ve güvenden ödün vermeden hizmet veriyoruz",
  items: [
    {
      title: "Ücretsiz Alım-Teslim",
      desc: "Halılarınızı kapınızdan alıyor, temizledikten sonra tekrar teslim ediyoruz.",
    },
    {
      title: "Uzman Ekip",
      desc: "Alanında deneyimli, eğitimli personelimizle güvenilir hizmet.",
    },
    {
      title: "Modern Ekipman",
      desc: "Son teknoloji makinelerle derinlemesine ve hijyenik temizlik.",
    },
    {
      title: "Uygun Fiyat",
      desc: "Kaliteden ödün vermeden, cebinizi yakmayan fiyatlar.",
    },
  ],
} as const;

export const PROCESS_DEFAULTS = {
  title: "Çalışma Sürecimiz",
  subtitle: "Kolay ve hızlı 4 adımda temiz halılara kavuşun",
  items: [
    {
      title: "Sipariş Alın",
      desc: "Telefon veya WhatsApp üzerinden randevu oluşturun.",
    },
    {
      title: "Ücretsiz Alım",
      desc: "Halılarınızı adresinizden ücretsiz olarak teslim alıyoruz.",
    },
    {
      title: "Profesyonel Yıkama",
      desc: "Fabrikamızda hijyenik koşullarda derinlemesine yıkama yapılır.",
    },
    {
      title: "Teslimat",
      desc: "Kurutulan halılarınız adresinize teslim edilir.",
    },
  ],
} as const;

export type HomeSectionContent = {
  title: string;
  subtitle: string;
  items: { title: string; desc: string }[];
};

// A blank/whitespace-only stored value means "not customised" — fall back to
// the default so a cleared admin field restores the original copy.
function pick(value: string | null | undefined, fallback: string): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

/** Merge stored SiteSettings values with the defaults, falling back per-field. */
export function resolveFeatures(site: SiteSettings): HomeSectionContent {
  return {
    title: pick(site.featuresTitleTr, FEATURES_DEFAULTS.title),
    subtitle: pick(site.featuresSubtitleTr, FEATURES_DEFAULTS.subtitle),
    items: [
      {
        title: pick(site.feature1TitleTr, FEATURES_DEFAULTS.items[0].title),
        desc: pick(site.feature1DescTr, FEATURES_DEFAULTS.items[0].desc),
      },
      {
        title: pick(site.feature2TitleTr, FEATURES_DEFAULTS.items[1].title),
        desc: pick(site.feature2DescTr, FEATURES_DEFAULTS.items[1].desc),
      },
      {
        title: pick(site.feature3TitleTr, FEATURES_DEFAULTS.items[2].title),
        desc: pick(site.feature3DescTr, FEATURES_DEFAULTS.items[2].desc),
      },
      {
        title: pick(site.feature4TitleTr, FEATURES_DEFAULTS.items[3].title),
        desc: pick(site.feature4DescTr, FEATURES_DEFAULTS.items[3].desc),
      },
    ],
  };
}

export function resolveProcess(site: SiteSettings): HomeSectionContent {
  return {
    title: pick(site.processTitleTr, PROCESS_DEFAULTS.title),
    subtitle: pick(site.processSubtitleTr, PROCESS_DEFAULTS.subtitle),
    items: [
      {
        title: pick(site.process1TitleTr, PROCESS_DEFAULTS.items[0].title),
        desc: pick(site.process1DescTr, PROCESS_DEFAULTS.items[0].desc),
      },
      {
        title: pick(site.process2TitleTr, PROCESS_DEFAULTS.items[1].title),
        desc: pick(site.process2DescTr, PROCESS_DEFAULTS.items[1].desc),
      },
      {
        title: pick(site.process3TitleTr, PROCESS_DEFAULTS.items[2].title),
        desc: pick(site.process3DescTr, PROCESS_DEFAULTS.items[2].desc),
      },
      {
        title: pick(site.process4TitleTr, PROCESS_DEFAULTS.items[3].title),
        desc: pick(site.process4DescTr, PROCESS_DEFAULTS.items[3].desc),
      },
    ],
  };
}
