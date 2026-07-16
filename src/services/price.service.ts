import { priceRepository, categoryRepository } from "@/repositories/price.repository";
import { priceSchema, categorySchema, type PriceInput, type CategoryInput } from "@/lib/validations/price.schema";

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
      category: data.categoryId ? { connect: { id: data.categoryId } } : undefined,
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
      category: data.categoryId
        ? { connect: { id: data.categoryId } }
        : { disconnect: true },
    });
  },

  delete: (id: string) => priceRepository.delete(id),
  toggleCampaign: (id: string, isCampaignActive: boolean) =>
    priceRepository.setCampaignActive(id, isCampaignActive),
};

export const categoryService = {
  list: () => categoryRepository.findAll(),
  getById: (id: string) => categoryRepository.findById(id),
  create: (input: CategoryInput) => {
    const data = categorySchema.parse(input);
    return categoryRepository.create({ ...data, nameEn: data.nameEn ?? data.nameTr });
  },
  update: (id: string, input: CategoryInput) => {
    const data = categorySchema.parse(input);
    return categoryRepository.update(id, { ...data, nameEn: data.nameEn ?? data.nameTr });
  },
  delete: (id: string) => categoryRepository.delete(id),
};
