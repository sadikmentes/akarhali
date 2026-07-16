import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const priceRepository = {
  findAll(where?: Prisma.PriceWhereInput) {
    return prisma.price.findMany({
      where,
      include: { service: true, category: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
  },

  findActive() {
    return this.findAll({ isActive: true });
  },

  findById(id: string) {
    return prisma.price.findUnique({
      where: { id },
      include: { service: true, category: true },
    });
  },

  create(data: Prisma.PriceCreateInput) {
    return prisma.price.create({
      data,
      include: { service: true, category: true },
    });
  },

  update(id: string, data: Prisma.PriceUpdateInput) {
    return prisma.price.update({
      where: { id },
      data,
      include: { service: true, category: true },
    });
  },

  delete(id: string) {
    return prisma.price.delete({ where: { id } });
  },

  setCampaignActive(id: string, isCampaignActive: boolean) {
    return prisma.price.update({
      where: { id },
      data: { isCampaignActive },
      include: { service: true, category: true },
    });
  },
};

export const categoryRepository = {
  findAll() {
    return prisma.category.findMany({ orderBy: { order: "asc" } });
  },
  findById(id: string) {
    return prisma.category.findUnique({ where: { id } });
  },
  create(data: Prisma.CategoryCreateInput) {
    return prisma.category.create({ data });
  },
  update(id: string, data: Prisma.CategoryUpdateInput) {
    return prisma.category.update({ where: { id }, data });
  },
  delete(id: string) {
    return prisma.category.delete({ where: { id } });
  },
};
