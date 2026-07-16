import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { galleryService } from "@/services/gallery.service";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("gallery");
  return { title: t("title"), description: t("subtitle") };
}

export default async function GalleryPage() {
  const t = await getTranslations("gallery");
  const images = await galleryService.list();

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <Container>
        <GalleryGrid images={images} />
      </Container>
    </>
  );
}
