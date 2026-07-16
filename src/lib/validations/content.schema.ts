import { z } from "zod";

export const faqSchema = z.object({
  questionTr: z.string().min(3, "Soru en az 3 karakter olmalı"),
  questionEn: z.string().optional(),
  answerTr: z.string().min(3, "Cevap en az 3 karakter olmalı"),
  answerEn: z.string().optional(),
  order: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});

export type FaqInput = z.infer<typeof faqSchema>;
export type FaqFormInput = z.input<typeof faqSchema>;
