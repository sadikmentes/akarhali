import { prisma } from "@/lib/prisma";
import type { GalleryCategory, Prisma } from "@prisma/client";

export const galleryRepository = {
  findAll(category?: GalleryCategory) {
    return prisma.galleryImage.findMany({
      where: category ? { category } : undefined,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
  },

  findById(id: string) {
    return prisma.galleryImage.findUnique({ where: { id } });
  },

  create(data: Prisma.GalleryImageCreateInput) {
    return prisma.galleryImage.create({ data });
  },

  update(id: string, data: Prisma.GalleryImageUpdateInput) {
    return prisma.galleryImage.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.galleryImage.delete({ where: { id } });
  },
};
