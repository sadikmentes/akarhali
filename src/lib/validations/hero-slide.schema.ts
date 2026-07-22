import { z } from "zod";

export const heroSlideSchema = z.object({
  url: z.string().min(1),
  publicId: z.string().min(1),
  titleTr: z.string().optional().nullable(),
  order: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});

export type HeroSlideInput = z.infer<typeof heroSlideSchema>;
