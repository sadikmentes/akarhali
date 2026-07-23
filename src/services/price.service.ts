import { priceRepository } from "@/repositories/price.repository";
import { priceSchema, type PriceInput } from "@/lib/validations/price.schema";

export const priceService = {
  list: () => priceRepository.findAll(),
  listActive: () => priceRepository.findActive(),
  getById: (id: string) => priceRepository.findById(id),

  async create(input: PriceInput) {
    const data = priceSchema.parse(input);
    return priceRepository.create({
      nameTr: data.nameTr,
      nameEn: data.nameEn ?? data.nameTr,
      unit: data.unit,
      basePrice: data.basePrice,
      discountPrice: data.discountPrice ?? null,
      isCampaignActive: data.isCampaignActive,
      isActive: data.isActive,
      order: data.order,
      service: { connect: { id: data.serviceId } },
    });
  },

  async update(id: string, input: PriceInput) {
    const data = priceSchema.parse(input);
    return priceRepository.update(id, {
      nameTr: data.nameTr,
      nameEn: data.nameEn ?? data.nameTr,
      unit: data.unit,
      basePrice: data.basePrice,
      discountPrice: data.discountPrice ?? null,
      isCampaignActive: data.isCampaignActive,
      isActive: data.isActive,
      order: data.order,
      service: { connect: { id: data.serviceId } },
    });
  },

  delete: (id: string) => priceRepository.delete(id),
  toggleCampaign: (id: string, isCampaignActive: boolean) =>
    priceRepository.setCampaignActive(id, isCampaignActive),
};
