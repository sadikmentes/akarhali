import { heroSlideRepository } from "@/repositories/hero-slide.repository";
import { deleteImage } from "@/lib/cloudinary";
import type { HeroSlideInput } from "@/lib/validations/hero-slide.schema";

export const heroSlideService = {
  list: () => heroSlideRepository.findAll(),
  listActive: () => heroSlideRepository.findActive(),
  getById: (id: string) => heroSlideRepository.findById(id),

  create: (data: HeroSlideInput) => heroSlideRepository.create(data),

  update: (id: string, data: Partial<HeroSlideInput>) => heroSlideRepository.update(id, data),

  async delete(id: string) {
    const slide = await heroSlideRepository.findById(id);
    if (slide) {
      // Cloudinary-hosted images get removed; local uploads fail silently.
      await deleteImage(slide.publicId).catch(() => undefined);
      await heroSlideRepository.delete(id);
    }
  },
};
