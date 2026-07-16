import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Mail, MapPin, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "@/components/shared/social-icons";
import { NAV_ITEMS, SITE_CONFIG } from "@/constants/site";
import { settingsService } from "@/services/settings.service";

export async function Footer() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");

  const [contact, social] = await Promise.all([
    settingsService.getContact(),
    settingsService.getSocial(),
  ]);

  const address = contact.addressTr;

  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center">
            <Image
              src="/akar-logo.png"
              alt={SITE_CONFIG.name}
              width={160}
              height={68}
              className="h-12 w-auto object-contain"
            />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{t("description")}</p>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">{t("quickLinks")}</h3>
          <ul className="space-y-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {tNav(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">{t("contact")}</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            {contact.phone && (
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0" />
                <a href={`tel:${contact.phone}`} className="hover:text-foreground">
                  {contact.phone}
                </a>
              </li>
            )}
            {contact.email && (
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0" />
                <a href={`mailto:${contact.email}`} className="hover:text-foreground">
                  {contact.email}
                </a>
              </li>
            )}
            {address && (
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                <span>{address}</span>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">{t("followUs")}</h3>
          <div className="flex gap-3">
            {social.instagram && (
              <a
                href={social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex size-10 items-center justify-center rounded-full bg-background transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <InstagramIcon className="size-5" />
              </a>
            )}
            {social.facebook && (
              <a
                href={social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex size-10 items-center justify-center rounded-full bg-background transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <FacebookIcon className="size-5" />
              </a>
            )}
            {social.youtube && (
              <a
                href={social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Youtube"
                className="flex size-10 items-center justify-center rounded-full bg-background transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <YoutubeIcon className="size-5" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="border-t py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} {SITE_CONFIG.name}. {t("rights")}
      </div>
    </footer>
  );
}
