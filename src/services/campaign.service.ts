import { campaignRepository } from "@/repositories/campaign.repository";
import { campaignSchema, type CampaignInput } from "@/lib/validations/campaign.schema";

export const campaignService = {
  list: () => campaignRepository.findAll(),
  listActive: () => campaignRepository.findActive(),
  getById: (id: string) => campaignRepository.findById(id),

  create(input: CampaignInput) {
    const data = campaignSchema.parse(input);
    return campaignRepository.create({
      ...data,
      titleEn: data.titleEn ?? data.titleTr,
      descriptionEn: data.descriptionEn ?? data.descriptionTr,
    });
  },

  update(id: string, input: CampaignInput) {
    const data = campaignSchema.parse(input);
    return campaignRepository.update(id, {
      ...data,
      titleEn: data.titleEn ?? data.titleTr,
      descriptionEn: data.descriptionEn ?? data.descriptionTr,
    });
  },

  delete: (id: string) => campaignRepository.delete(id),
  setActive: (id: string, isActive: boolean) => campaignRepository.update(id, { isActive }),
};
