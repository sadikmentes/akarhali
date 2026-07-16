import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const faqRepository = {
  findActive() {
    return prisma.faq.findMany({ where: { isActive: true }, orderBy: { order: "asc" } });
  },
  findAll() {
    return prisma.faq.findMany({ orderBy: { order: "asc" } });
  },
  create(data: Prisma.FaqCreateInput) {
    return prisma.faq.create({ data });
  },
  update(id: string, data: Prisma.FaqUpdateInput) {
    return prisma.faq.update({ where: { id }, data });
  },
  delete(id: string) {
    return prisma.faq.delete({ where: { id } });
  },
};

export const galleryImageCategories = ["CARPET", "SOFA", "CURTAIN", "BEFORE", "AFTER"] as const;
