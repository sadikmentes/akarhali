import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

// The settings tables are single-row ("singleton"). Reads happen on every page
// render, so they take the cheap path: a plain lookup, falling back to a create
// only when the row genuinely does not exist yet (first boot / fresh database).
async function readSingleton<T>(
  find: () => Promise<T | null>,
  create: () => Promise<T>
): Promise<T> {
  return (await find()) ?? (await create());
}

export const settingsRepository = {
  getSiteSettings() {
    return readSingleton(
      () => prisma.siteSettings.findUnique({ where: { id: "singleton" } }),
      () =>
        prisma.siteSettings.upsert({
          where: { id: "singleton" },
          update: {},
          create: { id: "singleton" },
        })
    );
  },
  updateSiteSettings(data: Prisma.SiteSettingsUpdateInput) {
    return prisma.siteSettings.update({ where: { id: "singleton" }, data });
  },

  getContactInfo() {
    return readSingleton(
      () => prisma.contactInfo.findUnique({ where: { id: "singleton" } }),
      () =>
        prisma.contactInfo.upsert({
          where: { id: "singleton" },
          update: {},
          create: { id: "singleton" },
        })
    );
  },
  updateContactInfo(data: Prisma.ContactInfoUpdateInput) {
    return prisma.contactInfo.update({ where: { id: "singleton" }, data });
  },

  getSocialLinks() {
    return readSingleton(
      () => prisma.socialLinks.findUnique({ where: { id: "singleton" } }),
      () =>
        prisma.socialLinks.upsert({
          where: { id: "singleton" },
          update: {},
          create: { id: "singleton" },
        })
    );
  },
  updateSocialLinks(data: Prisma.SocialLinksUpdateInput) {
    return prisma.socialLinks.update({ where: { id: "singleton" }, data });
  },

  getSeoSettings() {
    return readSingleton(
      () => prisma.seoSettings.findUnique({ where: { id: "singleton" } }),
      () =>
        prisma.seoSettings.upsert({
          where: { id: "singleton" },
          update: {},
          create: { id: "singleton" },
        })
    );
  },
  updateSeoSettings(data: Prisma.SeoSettingsUpdateInput) {
    return prisma.seoSettings.update({ where: { id: "singleton" }, data });
  },
};
