export const SITE_NAME = "Akar Halı";

export const SITE_CONFIG = {
  name: SITE_NAME,
  nameTr: "Akar Halı Yıkama",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  defaultLocale: "tr" as const,
  locales: ["tr"] as const,
};

export const NAV_ITEMS = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "services", href: "/services" },
  { key: "priceList", href: "/price-list" },
  { key: "campaigns", href: "/campaigns" },
  { key: "gallery", href: "/gallery" },
  { key: "faq", href: "/faq" },
  { key: "contact", href: "/contact" },
] as const;

export const ADMIN_NAV_ITEMS = [
  { key: "dashboard", href: "/admin", icon: "LayoutDashboard" },
  { key: "slider", href: "/admin/slider", icon: "Images" },
  { key: "prices", href: "/admin/prices", icon: "Tag" },
  { key: "campaigns", href: "/admin/campaigns", icon: "Megaphone" },
  { key: "gallery", href: "/admin/gallery", icon: "Image" },
  { key: "services", href: "/admin/services", icon: "Sparkles" },
  { key: "faq", href: "/admin/faq", icon: "HelpCircle" },
  { key: "content", href: "/admin/content", icon: "FileText" },
  { key: "contact", href: "/admin/contact", icon: "Phone" },
  { key: "users", href: "/admin/users", icon: "KeyRound" },
] as const;

export const GALLERY_CATEGORIES = [
  { value: "CARPET", labelTr: "Halı" },
  { value: "SOFA", labelTr: "Koltuk" },
  { value: "CURTAIN", labelTr: "Perde" },
  { value: "YATAK", labelTr: "Yatak" },
  { value: "YORGAN", labelTr: "Yorgan" },
  { value: "BATTANIYE", labelTr: "Battaniye" },
  { value: "SANDALYE", labelTr: "Sandalye" },
  { value: "YASTIK", labelTr: "Yastık" },
] as const;

// value -> Türkçe etiket eşlemesi. Base UI Select, seçili değerin etiketini
// göstermek için Select.Root'a bu haritayı `items` olarak ister.
export const GALLERY_CATEGORY_LABELS: Record<string, string> = {
  CARPET: "Halı",
  SOFA: "Koltuk",
  CURTAIN: "Perde",
  YATAK: "Yatak",
  YORGAN: "Yorgan",
  BATTANIYE: "Battaniye",
  SANDALYE: "Sandalye",
  YASTIK: "Yastık",
  BEFORE: "Öncesi",
  AFTER: "Sonrası",
};

export const DEFAULT_SERVICES = [
  { slug: "hali-yikama", titleTr: "Halı Yıkama", icon: "Waves" },
  { slug: "koltuk-yikama", titleTr: "Koltuk Yıkama", icon: "Sofa" },
  { slug: "perde-yikama", titleTr: "Perde Yıkama", icon: "Blinds" },
  { slug: "battaniye-yikama", titleTr: "Battaniye Yıkama", icon: "Layers" },
  { slug: "yorgan-yikama", titleTr: "Yorgan Yıkama", icon: "BedDouble" },
  { slug: "yatak-yikama", titleTr: "Yatak Yıkama", icon: "Bed" },
] as const;
