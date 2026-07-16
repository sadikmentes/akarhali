import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { InstagramIcon } from "@/components/shared/social-icons";
import { settingsService } from "@/services/settings.service";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("contact");
  return { title: t("title"), description: t("subtitle") };
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.76.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.87 9.87 0 0 0 12.04 2Zm0 18.13h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.36c0-4.53 3.69-8.22 8.24-8.22 2.2 0 4.27.86 5.82 2.41a8.17 8.17 0 0 1 2.41 5.82c0 4.54-3.69 8.21-8.22 8.21Zm4.51-6.16c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.96-.15.16-.29.18-.53.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.22-1.46-1.37-1.7-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.23.25-.85.83-.85 2.02s.87 2.34 1 2.5c.12.16 1.71 2.61 4.14 3.66.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.46-.6 1.66-1.17.21-.58.21-1.08.14-1.18-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  );
}

export default async function ContactPage() {
  const t = await getTranslations("contact");
  const tCta = await getTranslations("cta");
  const [site, contact, social] = await Promise.all([
    settingsService.getSite(),
    settingsService.getContact(),
    settingsService.getSocial(),
  ]);

  const address = contact.addressTr;
  const workingHours = contact.workingHoursTr;

  const mapSrc =
    site.mapEmbedUrl ||
    (site.mapLatitude && site.mapLongitude
      ? `https://www.google.com/maps?q=${site.mapLatitude},${site.mapLongitude}&z=15&output=embed`
      : null);

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <Container className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <h2 className="mb-6 text-xl font-bold">{t("info.title")}</h2>
          <ul className="space-y-5">
            {contact.phone && (
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 size-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">{t("info.phone")}</p>
                  <a href={`tel:${contact.phone}`} className="font-medium hover:underline">
                    {contact.phone}
                  </a>
                </div>
              </li>
            )}
            {contact.email && (
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 size-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">{t("info.email")}</p>
                  <a href={`mailto:${contact.email}`} className="font-medium hover:underline">
                    {contact.email}
                  </a>
                </div>
              </li>
            )}
            {address && (
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">{t("info.address")}</p>
                  <p className="font-medium">{address}</p>
                </div>
              </li>
            )}
            {workingHours && (
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 size-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">{t("info.workingHours")}</p>
                  <p className="font-medium">{workingHours}</p>
                </div>
              </li>
            )}
          </ul>

          {mapSrc && (
            <div className="mt-8 overflow-hidden rounded-2xl border shadow-sm">
              <iframe
                title="Akar Halı Konum"
                src={mapSrc}
                width="100%"
                height="280"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                className="w-full"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center gap-4 rounded-2xl border bg-gradient-to-br from-primary/10 via-card to-card p-8 shadow-sm">
          <h2 className="text-xl font-bold">
            Hemen İletişime Geçin
          </h2>
          <p className="text-muted-foreground">
            Sorularınız ve randevu talepleriniz için bize telefon veya WhatsApp üzerinden
            ulaşabilirsiniz. Size en kısa sürede yardımcı olalım.
          </p>

          <div className="mt-2 flex flex-col gap-3">
            {contact.phone && (
              <Button asChild size="lg" className="w-full">
                <a href={`tel:${contact.phone}`}>
                  <Phone className="size-5" />
                  {tCta("call")}
                </a>
              </Button>
            )}
            {social.whatsapp && (
              <Button
                asChild
                size="lg"
                className="w-full bg-[#25D366] text-white hover:bg-[#1eb959]"
              >
                <a href={social.whatsapp} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon className="size-5" />
                  {tCta("whatsapp")}
                </a>
              </Button>
            )}
            {social.instagram && (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full"
              >
                <a href={social.instagram} target="_blank" rel="noopener noreferrer">
                  <InstagramIcon className="size-5" />
                  {tCta("instagram")}
                </a>
              </Button>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
