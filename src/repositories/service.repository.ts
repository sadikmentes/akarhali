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

  // Main services (no parent) with their active sub-services, for the public
  // services page that renders an expandable accordion.
  findActiveTree() {
    return prisma.service.findMany({
      where: { isActive: true, parentId: null },
      orderBy: { order: "asc" },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
      },
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

  create(data: Prisma.ServiceUncheckedCreateInput) {
    return prisma.service.create({ data });
  },

  update(id: string, data: Prisma.ServiceUncheckedUpdateInput) {
    return prisma.service.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.service.delete({ where: { id } });
  },
};
