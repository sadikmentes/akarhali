import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const priceRepository = {
  findAll(where?: Prisma.PriceWhereInput) {
    return prisma.price.findMany({
      where,
      include: { service: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
  },

  findActive() {
    return this.findAll({ isActive: true });
  },

  findById(id: string) {
    return prisma.price.findUnique({
      where: { id },
      include: { service: true },
    });
  },

  create(data: Prisma.PriceCreateInput) {
    return prisma.price.create({
      data,
      include: { service: true },
    });
  },

  update(id: string, data: Prisma.PriceUpdateInput) {
    return prisma.price.update({
      where: { id },
      data,
      include: { service: true },
    });
  },

  delete(id: string) {
    return prisma.price.delete({ where: { id } });
  },

  setCampaignActive(id: string, isCampaignActive: boolean) {
    return prisma.price.update({
      where: { id },
      data: { isCampaignActive },
      include: { service: true },
    });
  },
};
