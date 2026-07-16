import { settingsRepository } from "@/repositories/settings.repository";
import type { Prisma } from "@prisma/client";

export const settingsService = {
  getSite: () => settingsRepository.getSiteSettings(),
  updateSite: (data: Prisma.SiteSettingsUpdateInput) => settingsRepository.updateSiteSettings(data),

  getContact: () => settingsRepository.getContactInfo(),
  updateContact: (data: Prisma.ContactInfoUpdateInput) => settingsRepository.updateContactInfo(data),

  getSocial: () => settingsRepository.getSocialLinks(),
  updateSocial: (data: Prisma.SocialLinksUpdateInput) => settingsRepository.updateSocialLinks(data),

  getSeo: () => settingsRepository.getSeoSettings(),
  updateSeo: (data: Prisma.SeoSettingsUpdateInput) => settingsRepository.updateSeoSettings(data),
};
