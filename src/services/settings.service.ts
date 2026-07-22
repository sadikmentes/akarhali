import { cache } from "react";
import { settingsRepository } from "@/repositories/settings.repository";
import type { Prisma } from "@prisma/client";

// Settings are read from several places in a single render (layout, metadata,
// footer and the page itself all want contact/social). `cache` collapses those
// into one query per request instead of one per call site.
export const settingsService = {
  getSite: cache(() => settingsRepository.getSiteSettings()),
  updateSite: (data: Prisma.SiteSettingsUpdateInput) => settingsRepository.updateSiteSettings(data),

  getContact: cache(() => settingsRepository.getContactInfo()),
  updateContact: (data: Prisma.ContactInfoUpdateInput) => settingsRepository.updateContactInfo(data),

  getSocial: cache(() => settingsRepository.getSocialLinks()),
  updateSocial: (data: Prisma.SocialLinksUpdateInput) => settingsRepository.updateSocialLinks(data),

  getSeo: cache(() => settingsRepository.getSeoSettings()),
  updateSeo: (data: Prisma.SeoSettingsUpdateInput) => settingsRepository.updateSeoSettings(data),
};
