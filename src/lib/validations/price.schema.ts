import { z } from "zod";

export const priceSchema = z.object({
  serviceId: z.string().min(1, "Hizmet seçimi zorunludur"),
  nameTr: z.string().min(2, "Türkçe isim en az 2 karakter olmalı"),
  nameEn: z.string().optional(),
  unit: z.enum(["M2", "PIECE"]),
  basePrice: z.coerce.number().positive("Fiyat pozitif olmalı"),
  discountPrice: z.coerce.number().positive().optional().nullable(),
  isCampaignActive: z.boolean().default(false),
  isActive: z.boolean().default(true),
  order: z.coerce.number().int().default(0),
});

export type PriceInput = z.infer<typeof priceSchema>;
export type PriceFormInput = z.input<typeof priceSchema>;
