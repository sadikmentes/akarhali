import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const settingsRepository = {
  getSiteSettings() {
    return prisma.siteSettings.upsert({
      where: { id: "singleton" },
      update: {},
      create: { id: "singleton" },
    });
  },
  updateSiteSettings(data: Prisma.SiteSettingsUpdateInput) {
    return prisma.siteSettings.update({ where: { id: "singleton" }, data });
  },

  getContactInfo() {
    return prisma.contactInfo.upsert({
      where: { id: "singleton" },
      update: {},
      create: { id: "singleton" },
    });
  },
  updateContactInfo(data: Prisma.ContactInfoUpdateInput) {
    return prisma.contactInfo.update({ where: { id: "singleton" }, data });
  },

  getSocialLinks() {
    return prisma.socialLinks.upsert({
      where: { id: "singleton" },
      update: {},
      create: { id: "singleton" },
    });
  },
  updateSocialLinks(data: Prisma.SocialLinksUpdateInput) {
    return prisma.socialLinks.update({ where: { id: "singleton" }, data });
  },

  getSeoSettings() {
    return prisma.seoSettings.upsert({
      where: { id: "singleton" },
      update: {},
      create: { id: "singleton" },
    });
  },
  updateSeoSettings(data: Prisma.SeoSettingsUpdateInput) {
    return prisma.seoSettings.update({ where: { id: "singleton" }, data });
  },
};
