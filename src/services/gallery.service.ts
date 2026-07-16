import { galleryRepository } from "@/repositories/gallery.repository";
import { deleteImage, uploadImage } from "@/lib/cloudinary";
import { galleryImageSchema, type GalleryImageInput } from "@/lib/validations/gallery.schema";
import type { GalleryCategory } from "@prisma/client";

export const galleryService = {
  list: (category?: GalleryCategory) => galleryRepository.findAll(category),
  getById: (id: string) => galleryRepository.findById(id),

  async uploadAndCreate(fileBuffer: Buffer, input: Omit<GalleryImageInput, "url" | "publicId">) {
    const uploaded = await uploadImage(fileBuffer, "gallery");
    const data = galleryImageSchema.parse({ ...input, ...uploaded });
    return galleryRepository.create(data);
  },

  update(id: string, input: Partial<GalleryImageInput>) {
    return galleryRepository.update(id, input);
  },

  async delete(id: string) {
    const image = await galleryRepository.findById(id);
    if (image) {
      await deleteImage(image.publicId).catch(() => undefined);
      await galleryRepository.delete(id);
    }
  },
};
