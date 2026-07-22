import { z } from "zod";

export const galleryCategorySchema = z.enum([
  "CARPET",
  "SOFA",
  "CURTAIN",
  "YATAK",
  "YORGAN",
  "BATTANIYE",
  "SANDALYE",
  "YASTIK",
  "BEFORE",
  "AFTER",
]);

export const galleryImageSchema = z.object({
  url: z.string().min(1),
  publicId: z.string().min(1),
  category: galleryCategorySchema,
  titleTr: z.string().optional().nullable(),
  titleEn: z.string().optional().nullable(),
  order: z.coerce.number().int().default(0),
});

export type GalleryImageInput = z.infer<typeof galleryImageSchema>;
