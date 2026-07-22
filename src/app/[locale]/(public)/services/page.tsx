import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { ServicesAccordion } from "@/components/services/services-accordion";
import { serviceService } from "@/services/service.service";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("services");
  return { title: t("title"), description: t("subtitle") };
}

export default async function ServicesPage() {
  const t = await getTranslations("services");
  const services = await serviceService.listActiveTree();

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <Container>
        {services.length === 0 ? (
          <p className="text-center text-muted-foreground">Henüz hizmet eklenmedi.</p>
        ) : (
          <ServicesAccordion services={services} />
        )}
      </Container>
    </>
  );
}
