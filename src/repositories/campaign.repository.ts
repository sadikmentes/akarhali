import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const campaignRepository = {
  findAll() {
    return prisma.campaign.findMany({ orderBy: { createdAt: "desc" } });
  },

  findActive() {
    const now = new Date();
    return prisma.campaign.findMany({
      where: { isActive: true, startDate: { lte: now }, endDate: { gte: now } },
      orderBy: { createdAt: "desc" },
    });
  },

  findById(id: string) {
    return prisma.campaign.findUnique({ where: { id } });
  },

  create(data: Prisma.CampaignCreateInput) {
    return prisma.campaign.create({ data });
  },

  update(id: string, data: Prisma.CampaignUpdateInput) {
    return prisma.campaign.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.campaign.delete({ where: { id } });
  },
};
