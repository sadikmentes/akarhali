import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/shared/section-heading";

type MapSectionProps = {
  embedUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

export function MapSection({ embedUrl, latitude, longitude }: MapSectionProps) {
  const t = useTranslations("home.map");

  const src =
    embedUrl ||
    (latitude && longitude
      ? `https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`
      : null);

  if (!src) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading title={t("title")} subtitle={t("subtitle")} />
      <div className="overflow-hidden rounded-2xl border shadow-sm">
        <iframe
          title="Akar Halı Konum"
          src={src}
          width="100%"
          height="450"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          className="w-full"
        />
      </div>
    </section>
  );
}
