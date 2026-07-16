import { z } from "zod";

export const campaignSchema = z
  .object({
    titleTr: z.string().min(2, "Başlık en az 2 karakter olmalı"),
    titleEn: z.string().optional(),
    descriptionTr: z.string().optional().nullable(),
    descriptionEn: z.string().optional().nullable(),
    image: z.string().min(1, "Kampanya görseli zorunludur"),
    discountPercent: z.coerce.number().int().min(1).max(100),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    isActive: z.boolean().default(true),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "Bitiş tarihi başlangıç tarihinden sonra olmalı",
    path: ["endDate"],
  });

export type CampaignInput = z.infer<typeof campaignSchema>;
export type CampaignFormInput = z.input<typeof campaignSchema>;
