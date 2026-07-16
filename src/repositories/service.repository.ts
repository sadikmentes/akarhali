import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const serviceRepository = {
  findAll() {
    return prisma.service.findMany({ orderBy: { order: "asc" } });
  },

  findActive() {
    return prisma.service.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
  },

  findBySlug(slug: string) {
    return prisma.service.findUnique({
      where: { slug },
      include: { prices: { where: { isActive: true } } },
    });
  },

  findById(id: string) {
    return prisma.service.findUnique({ where: { id } });
  },

  create(data: Prisma.ServiceCreateInput) {
    return prisma.service.create({ data });
  },

  update(id: string, data: Prisma.ServiceUpdateInput) {
    return prisma.service.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.service.delete({ where: { id } });
  },
};
