import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Waves, Sofa, Blinds, Layers, BedDouble, Bed, Sparkles } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { serviceService } from "@/services/service.service";

const ICON_MAP: Record<string, typeof Waves> = {
  "hali-yikama": Waves,
  "koltuk-yikama": Sofa,
  "perde-yikama": Blinds,
  "battaniye-yikama": Layers,
  "yorgan-yikama": BedDouble,
  "yatak-yikama": Bed,
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("services");
  return { title: t("title"), description: t("subtitle") };
}

export default async function ServicesPage() {
  const t = await getTranslations("services");
  const services = await serviceService.listActive();

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <Container>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = ICON_MAP[service.slug] ?? Sparkles;
            const title = service.titleTr;
            const description = service.descriptionTr ?? "";
            return (
              <div
                key={service.id}
                className="group rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            );
          })}
        </div>
        {services.length === 0 && (
          <p className="text-center text-muted-foreground">Henüz hizmet eklenmedi.</p>
        )}
      </Container>
    </>
  );
}
